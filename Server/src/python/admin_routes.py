# admin_routes.py
from fastapi import APIRouter
import pandas as pd
import uuid
from model_loader import get_models
from predictor import predict, extract_keywords, extract_model_guided_phrases
from fastapi import UploadFile, File, Form, Body
import shutil
from datetime import datetime
import os
import re
import numpy as np

from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI
from transformers import pipeline

from collections import defaultdict
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import faiss


router = APIRouter(prefix="/admin", tags=["Admin"])

CSV_FILE = r"D:\HuongSen_Project\Server\src\python\data\review.csv"
CSV_ENCODING = "utf-8-sig"

from pydantic import BaseModel

class ModelConfig(BaseModel):
    level1: str
    level2a: str
    level2b: str

class ExplainRequest(BaseModel):
    content: str
    level1: str
    level2a: str
    level2b: str
    
class PredictByFileRequest(BaseModel):
    level1: str
    level2a: str
    level2b: str
    file_name: str

    
    
_MODEL_CACHE = {}

def get_models_cached(config):
    key = tuple(config.items())
    if key not in _MODEL_CACHE:
        _MODEL_CACHE[key] = get_models(config)
    return _MODEL_CACHE[key]   
    
    
    
@router.post("/reviews/predict")
def admin_predict_reviews(config: ModelConfig):
    config = {k: v.upper() for k, v in config.dict().items()}
    lvl1, lvl2a, lvl2b = get_models_cached(config)

    df = pd.read_csv(CSV_FILE, encoding=CSV_ENCODING)

    stats = {
        "total": len(df),
        5: {"count": 0},
        4: {"count": 0},
        3: {"count": 0},
        2: {"count": 0},
        1: {"count": 0},
    }

    for _, row in df.iterrows():
        text = str(row["Nội dung review"]) if pd.notna(row["Nội dung review"]) else ""
        if not text.strip():
            continue
        star = int(predict(text, lvl1, lvl2a, lvl2b))
        if star in stats:
            stats[star]["count"] += 1
    return stats


@router.post("/reviews/predict/detail")
def admin_predict_reviews_detail(config: ModelConfig):
    config = {k: v.upper() for k, v in config.dict().items()}
    lvl1, lvl2a, lvl2b = get_models_cached(config)

    df = pd.read_csv(CSV_FILE, encoding=CSV_ENCODING)
    results = []

    for idx, row in df.iterrows():
        text = str(row["Nội dung review"]) if pd.notna(row["Nội dung review"]) else ""
        if not text.strip():
            continue
        star = int(predict(text, lvl1, lvl2a, lvl2b))

        results.append({

            "id": str(uuid.uuid4()),                  # 👈 QUAN TRỌNG: để frontend gọi explain
            "content": text,
            "star": star,
            "has_explain": False,        # flag
            "Người gửi": row.get("Người gửi", ""),
            "Ngày review": row.get("Ngày review", "")
        })

    return {
        "total": len(results),
        "reviews": results
    }


# @router.post("/reviews/explain")
# def admin_explain_review(payload: dict):
#     """
#     payload = {
#         content: "...",
#         level1: "...",
#         level2a: "...",
#         level2b: "..."
#     }
#     """
#     text = payload["content"]

#     config = {
#         "level1": payload["level1"].upper(),
#         "level2a": payload["level2a"].upper(),
#         "level2b": payload["level2b"].upper()
#     }

#     lvl1, lvl2a, lvl2b = get_models_cached(config)

#     star = int(predict(text, lvl1, lvl2a, lvl2b))

#     keywords = extract_keywords(text, star, lvl1, lvl2a, lvl2b)

#     return {
#         "star": star,
#         "keywords": keywords
#     }

STOPWORDS = {
    "nhưng", "và", "là", "thì", "mà",
    "với", "về", "từ", "đến", "trong", "ngoài",
    "giữa", "sau", "trước", "bởi", "do", "vì",
    "nên", "hay", "hoặc", "lại", "có"
}

def clean_tokens(phrase):
    return [
        t for t in phrase.split()
        if t not in STOPWORDS
    ]

MIN_IMPACT = 0.01
BAD_CONNECTORS = {"nhưng", "tuy", "tuy nhiên", "mặc dù"}
SENTIMENT_WORDS = {
    "ngon", "đẹp", "tuyệt", "thoải", "ồn",
    "khó", "chịu", "thân", "thiện",
    "xứng", "đáng", "ổn", "mát"
}

def remove_overlapping_phrases(phrases, top_k=5):

    if not phrases:
        return []

    normalized = [
        (p.replace("_", " ").strip(), float(s))
        for p, s in phrases
        if p and str(p).strip()
    ]

    # sort theo độ ảnh hưởng tuyệt đối
    normalized.sort(key=lambda x: abs(x[1]), reverse=True)

    selected = []

    for phrase, score in normalized:

        raw_lower = phrase.lower()
        tokens = raw_lower.split()

        # bỏ phrase quá ngắn
        if len(tokens) < 2:
            continue

        # bỏ phrase bắt đầu/kết thúc bằng stopword
        if tokens[0] in STOPWORDS or tokens[-1] in STOPWORDS:
            continue

        # bỏ phrase chứa connector kiểu "nhưng", "tuy nhiên"
        if any(c in raw_lower for c in BAD_CONNECTORS):
            continue

        # bắt buộc phải chứa ít nhất 1 từ sentiment
        if not any(w in raw_lower for w in SENTIMENT_WORDS):
            continue

        # loại overlap
        keep = True
        for sel_phrase, _ in selected:
            sel_tokens = sel_phrase.lower().split()
            overlap = len(set(tokens) & set(sel_tokens)) / max(len(tokens), 1)
            if overlap >= 0.5:
                keep = False
                break

        if keep:
            selected.append((phrase, score))

        if len(selected) >= top_k:
            break

    return selected
# def remove_overlapping_phrases(phrases):
#     """
#     phrases: list of tuples (phrase, score)

#     Return:
#         list of non-overlapping informative phrases
#     """

#     # Chuẩn hóa
#     normalized = [
#         (p.replace("_", " ").strip(), float(s))
#         for p, s in phrases
#     ]

#     # Sort theo score và độ dài
#     normalized.sort(key=lambda x: (x[1], len(x[0])), reverse=True)

#     selected = []

#     for phrase, score in normalized:
#         phrase_tokens = set(phrase.split())

#         keep = True
#         for sel_phrase, _ in selected:
#             sel_tokens = set(sel_phrase.split())

#             # Nếu phrase là con của phrase đã chọn
#             # if phrase in sel_phrase:
#             #     keep = False
#             #     break

#             # Nếu overlap quá lớn (>70%)
#             overlap = len(phrase_tokens & sel_tokens) / max(len(phrase_tokens), 1)
#             if overlap > 0.6:
#                 keep = False
#                 break

#         if keep:
#             selected.append((phrase, score))

#     return selected


def extract_review_text(raw_text: str) -> str:
    if not isinstance(raw_text, str):
        raw_text = str(raw_text)

    text = raw_text

    # bỏ icon sao
    text = re.sub(r"[★]+", "", text)

    # bỏ dòng thời gian
    text = re.sub(
        r"\d{1,2}:\d{2}\s+\d{1,2}/\d{1,2}/\d{4}",
        "",
        text
    )

    # bỏ dòng quá ngắn (metadata)
    lines = [
        l.strip()
        for l in text.splitlines()
        if len(l.strip()) > 10
    ]

    # 🔥 QUAN TRỌNG: GHÉP LẠI TOÀN BỘ, KHÔNG CHỈ LẤY DÒNG CUỐI
    return " ".join(lines)

NEGATIVE_WORDS = {
    "không", "k", "chưa",
    "ồn", "khó", "chịu",
    "bí", "tối", "cứng",
    "thiếu", "tệ"
}

POSITIVE_WORDS = {
    "ngon", "đẹp", "thoải",
    "mát", "tốt", "chuyên",
    "nhanh", "hài lòng",
    "ấn tượng", "tuyệt"
}
def select_phrases_by_star(phrases, star, top_k=4):

    positive = []
    negative = []

    for p, s in phrases:
        tokens = p.lower().split()

        if any(w in tokens for w in NEGATIVE_WORDS):
            negative.append((p, s))
        elif any(w in tokens for w in POSITIVE_WORDS):
            positive.append((p, s))
        else:
            positive.append((p, s))  # default

    positive.sort(key=lambda x: x[1], reverse=True)
    negative.sort(key=lambda x: x[1], reverse=True)

    if star >= 4:
        return positive[:top_k], negative[:1]

    elif star == 3:
        return positive[:2], negative[:2]

    else:
        return positive[:1], negative[:top_k]
    
@router.post("/reviews/explain")
def admin_explain_review(payload: ExplainRequest = Body(...)): # Thêm Body(...) ở đây
    # 1. Lấy content từ payload
    raw_text = payload.content.strip() if payload.content else ""
    
    if not raw_text:
        return {"star": 3, "salient_phrases": []}

    # 2. Xử lý text
    text = extract_review_text(raw_text)
    if not text:
        text = raw_text 

    # 3. Lấy config
    config = {
        "level1": (payload.level1 or "SVM").upper(),
        "level2a": (payload.level2a or "SVM").upper(),
        "level2b": (payload.level2b or "SVM").upper()
    }

    lvl1, lvl2a, lvl2b = get_models_cached(config)

    # 4. Dự đoán
    star = int(predict(text, lvl1, lvl2a, lvl2b))
    raw_phrases = extract_model_guided_phrases(text, lvl1, lvl2a, lvl2b)

    # Không remove_overlapping_phrases
    raw_phrases.sort(key=lambda x: abs(x[1]), reverse=True)

    selected_phrases = raw_phrases[:3]
    
    suggestions = generate_suggestions(selected_phrases, star)
    
    
    # ÉP KIỂU VỀ FLOAT THUẦN PYTHON ĐỂ FRONTEND ĐỌC ĐƯỢC
    # formatted_phrases = [
    #     {
    #         "phrase": p,
    #         "impact": round(s, 4)
    #     }
    #     for p, s in filtered_phrases
    # ]
    # Lấy max abs impact
    formatted_phrases = []

    for p, s in selected_phrases:
        formatted_phrases.append({
            "phrase": p,
            "impact_raw": round(float(s), 4),
            "impact": round(min(abs(float(s)), 1.0), 4)
        })


    return {
        "star": star,
        "phrases": formatted_phrases,
        "suggestions": suggestions
    }





from typing import List

@router.post("/reviews/upload")
async def upload_reviews_files(
    files: List[UploadFile] = File(...)
):
    save_dir = r"D:\HuongSen_Project\Server\src\python\data\tonghop"
    os.makedirs(save_dir, exist_ok=True)

    saved_files = []

    for file in files:
        # 1️⃣ đọc file
        if file.filename.endswith(".csv"):
            df_new = pd.read_csv(file.file)
        elif file.filename.endswith((".xlsx", ".xls")):
            df_new = pd.read_excel(file.file)
        else:
            continue  # bỏ file không hợp lệ

        # 2️⃣ validate
        if "Nội dung review" not in df_new.columns:
            continue

        # 3️⃣ thêm cột nếu thiếu
        if "Người gửi" not in df_new.columns:
            df_new["Người gửi"] = "Ẩn danh"

        if "Ngày review" not in df_new.columns:
            df_new["Ngày review"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        # 4️⃣ tạo file mới
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        new_file_name = f"review_{timestamp}.csv"
        new_file_path = os.path.join(save_dir, new_file_name)

        df_new.to_csv(new_file_path, index=False, encoding="utf-8-sig")

        saved_files.append({
            "original_name": file.filename,
            "file_name": new_file_name,
            "total_rows": len(df_new)
        })

    return {
        "success": True,
        "files": saved_files
    }



@router.post("/reviews/predict/by-file")
def admin_predict_reviews_by_file(payload: PredictByFileRequest):
    config = {
        "level1": payload.level1.upper(),
        "level2a": payload.level2a.upper(),
        "level2b": payload.level2b.upper(),
    }

    lvl1, lvl2a, lvl2b = get_models_cached(config)

    file_path = os.path.join(
        r"D:\HuongSen_Project\Server\src\python\data\tonghop",
        payload.file_name
    )

    if not os.path.exists(file_path):
        return {"error": "File không tồn tại"}

    df = pd.read_csv(file_path, encoding=CSV_ENCODING)

    stats = {
        "total": len(df),
        5: {"count": 0},
        4: {"count": 0},
        3: {"count": 0},
        2: {"count": 0},
        1: {"count": 0},
    }

    reviews = []

    for idx, row in df.iterrows():
        text = str(row["Nội dung review"]) if pd.notna(row["Nội dung review"]) else ""
        if not text.strip():
            continue

        star = int(predict(text, lvl1, lvl2a, lvl2b))
        if star in stats:
            stats[star]["count"] += 1

        reviews.append({
        "id": str(uuid.uuid4()),
        "content": text,
        "star": star,
        "has_explain": False,
        "Người gửi": row.get("Người gửi", "Ẩn danh"),
        "Ngày review": row.get("Ngày review", "")
    })


    return {
        "stats": stats,
        "reviews": reviews
    }
    
@router.post("/reviews/upload-and-predict")
async def upload_and_predict_reviews(
    files: list[UploadFile] = File(...),
    level1: str = Form(...),
    level2a: str = Form(...),
    level2b: str = Form(...)
):
    # 1️⃣ load model (cache)
    config = {
        "level1": level1.upper(),
        "level2a": level2a.upper(),
        "level2b": level2b.upper()
    }
    lvl1, lvl2a, lvl2b = get_models_cached(config)

    dfs = []

    # 2️⃣ đọc tất cả file
    for file in files:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file.file)
        else:
            continue

        if "Nội dung review" in df.columns:
            dfs.append(df)

    if not dfs:
        return {"error": "Không có file hợp lệ"}

    # 3️⃣ merge
    merged_df = pd.concat(dfs, ignore_index=True)

    # 🔥 4️⃣ LƯU FILE (HƯỚNG 1)
    save_dir = r"D:\HuongSen_Project\Server\src\python\data\tonghop"
    os.makedirs(save_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    saved_file_name = f"review_{timestamp}.csv"
    saved_file_path = os.path.join(save_dir, saved_file_name)

    merged_df.to_csv(saved_file_path, index=False, encoding="utf-8-sig")

    # 5️⃣ predict
    stats = {
        "total": len(merged_df),
        5: {"count": 0},
        4: {"count": 0},
        3: {"count": 0},
        2: {"count": 0},
        1: {"count": 0},
    }

    reviews = []

    for idx, row in merged_df.iterrows():
        text = str(row["Nội dung review"]) if pd.notna(row["Nội dung review"]) else ""
        if not text.strip():
            continue

        star = int(predict(text, lvl1, lvl2a, lvl2b))
        if star in stats:
            stats[star]["count"] += 1

        reviews.append({
            "id": str(uuid.uuid4()),
            "content": text,
            "star": star,
            "has_explain": False,
            "Người gửi": row.get("Người gửi", "Ẩn danh"),
            "Ngày review": row.get("Ngày review", "")
        })

    return {
        "saved_file": saved_file_name,  # 👈 QUAN TRỌNG
        "stats": stats,
        "reviews": reviews
    }
    
    
    

# IMPROVEMENT_MAP = {
#     "chậm":                 "Tăng cường đào tạo lại kỹ năng phục vụ cho nhân viên, đồng thời sắp xếp nhân sự và quy trình làm việc hợp lý trong giờ cao điểm để giảm thời gian chờ của khách.",
#     "lâu":                  "Tối ưu quy trình chế biến và phục vụ để rút ngắn thời gian chờ món của khách hàng.",
#     "ồn":                   "Giảm mức âm thanh và bố trí thêm vật liệu cách âm để hạn chế tiếng ồn, giúp không gian yên tĩnh và tạo cảm giác thoải mái hơn cho khách hàng.",
#     "cao":                  "Điều chỉnh mức giá hợp lý hơn hoặc nâng cao chất lượng món ăn và dịch vụ để phù hợp với giá tiền khách hàng bỏ ra.",
#     "nguội":                "Sử dụng dụng cụ giữ nhiệt hoặc đậy nắp món ăn khi mang ra, đồng thời cải thiện quy trình phục vụ để đảm bảo món ăn vẫn nóng khi đến tay khách hàng.",
#     "kém":                  "Đào tạo lại kỹ năng và thái độ phục vụ của nhân viên để nâng cao chất lượng phục vụ khách hàng.",
    
#     "ánh_sáng":             "Tăng cường hệ thống chiếu sáng hoặc bổ sung thêm đèn để không gian sáng hơn, tạo cảm giác thoải mái và dễ chịu cho khách hàng.",
#     "không tươi":           "Tăng cường kiểm tra chất lượng rau củ khi nhập hàng, sử dụng nguyên liệu trong ngày và bảo quản đúng cách để đảm bảo độ tươi của món ăn.",
    
#     "ít hỗ_trợ":            "Nhắc nhở và phân công nhân viên thường xuyên quan sát, chủ động hỗ trợ khách hàng kịp thời để nâng cao chất lượng phục vụ.",
#     "trình_bày kém":        "Cải thiện cách trình bày món ăn bằng cách phân chia khẩu phần hợp lý và sắp xếp món ăn cân đối để món ăn trông đẹp mắt và hấp dẫn hơn.",
    
#     "chưa có nổi_bật":      "Tạo thêm điểm nhấn trong món ăn, không gian hoặc phong cách phục vụ để mang lại trải nghiệm ấn tượng hơn cho khách hàng.",
#     "nhắc lại yêu cầu":     "Tăng cường nhắc nhở và đào tạo nhân viên lắng nghe yêu cầu của khách, đồng thời cải thiện quy trình ghi nhận order để hạn chế việc khách phải nhắc lại nhiều lần.",
    
#     "bí":                   "Sắp xếp lại bàn ghế hợp lý để không gian quán trở nên thoáng hơn và tạo cảm giác dễ chịu cho khách hàng.",
    
#     "cứng":                 "Điều chỉnh hoặc thay thế ghế có thiết kế êm ái hơn, đồng thời bổ sung đệm ngồi để mang lại cảm giác thoải mái cho khách hàng khi ngồi lâu, ví dụ như ghế bọc da, ghế có tựa lưng êm hoặc ghế có lót nệm dày.",
    
#     "tệ":                   "Rà soát lại quy trình phục vụ, chất lượng món ăn, không gian và thái độ của nhân viên để khắc phục các vấn đề và nâng cao trải nghiệm của khách hàng.",
#     "trải nghiệm chưa tốt": "Rà soát lại quy trình phục vụ, chất lượng món ăn, không gian và thái độ của nhân viên để khắc phục các vấn đề và nâng cao trải nghiệm của khách hàng.",
    
#     "thiếu nhiệt_tình":     "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
#     "nhân_viên khó_chịu":   "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
#     "không thân_thiện":     "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
#     "thờ_ơ":                "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
    
#     "khó_chịu":             "Kiểm tra và cải thiện hệ thống thông gió, đồng thời vệ sinh không gian thường xuyên để hạn chế mùi khó chịu trong quán.",
#     "ăn_không thoải_mái":   "Kiểm tra và cải thiện hệ thống thông gió, đồng thời vệ sinh không gian thường xuyên để hạn chế mùi khó chịu trong quán.",
    
#     "trung_bình":           "Cải thiện chất lượng món ăn, nguyên liệu và cách phục vụ để mang lại trải nghiệm tốt hơn cho khách hàng.",
#     "không như mong_đợi":   "Cải thiện chất lượng món ăn, nguyên liệu, cách phục vụ và không gian để mang lại trải nghiệm tốt hơn cho khách hàng.",
    
#     "chưa ấn_tượng":        "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "không ngon":           "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "ăn_không ngon":        "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "không quá đặc_sắc":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "đồ ăn bình_thường":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "nêm chưa vừa_miệng":   "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "không hợp_khẩu_vị":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "chưa thật_sự ấn_tượng": "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng."
    
# }

# SYNONYM_MAP = {
#     "chậm": ["đợi lâu", "chờ lâu", "mất thời gian", "phục_vụ chậm"],
#     "lâu": ["đợi lâu", "chờ lâu", "mất thời gian"],
#     "ồn": ["ồn ào", "nhiều tiếng", "khá ồn", "hơi ồn"],
#     "bí": ["chật", "ngột ngạt", "không thoáng", "thiếu thoải_mái"],
#     "cứng": ["ngồi_không thoải_mái"],
#     "cao": ["đắt", "hơi mắc", "giá mắc"],
#     "nguội": ["không nóng", "đồ ăn nguội", "món nguội", "lạnh"],
#     "kém": ["không tốt", "tệ", "chất lượng kém"],
#     "khó_chịu": ["mùi khó_chịu", "mùi hôi"],
#     "không ngon": ["dở", "không hợp_khẩu_vị", "nhạt", "không hấp_dẫn", "khó cảm_nhận hương_vị", "thiếu sáng_tạo", "thiếu điểm nhấn", "không để ấn_tượng"],
#     "không như mong_đợi": ["không thực_sự hài_lòng"],

# }

# def generate_suggestions(phrases, star):

#     improvements = set()

#     for phrase, score in phrases:

#         phrase = phrase.lower()
#         matched = False

#         # 1️⃣ Keyword match (logic cũ)
#         for keyword in IMPROVEMENT_MAP:
#             if keyword in phrase:
#                 improvements.add(IMPROVEMENT_MAP[keyword])
#                 matched = True

#         # 2️⃣ Synonym fallback
#         if not matched:
#             for keyword, synonyms in SYNONYM_MAP.items():
#                 for syn in synonyms:
#                     if syn in phrase:
#                         if keyword in IMPROVEMENT_MAP:
#                             improvements.add(IMPROVEMENT_MAP[keyword])
#                             matched = True
#                             break
#                 if matched:
#                     break

#     improvements = list(improvements)

#     # Logic theo số sao
#     if star <= 2:
#         result = improvements[:3]
#     elif star == 3:
#         result = improvements[:3]
#     elif star == 4:
#         result = improvements[:3]
#     else:
#         result = []

#     return {
#         "improvements": result
#     }


# @router.post("/reviews/suggest")
# def suggest(data: dict):
#     phrases = data.get("phrases", [])
#     star = data.get("star", 3)

#     # đảm bảo đúng format
#     clean_phrases = []

#     for p in phrases:
#         if isinstance(p, list) and len(p) == 2:
#             clean_phrases.append((p[0], p[1]))
#         elif isinstance(p, dict):
#             clean_phrases.append((p.get("phrase",""), p.get("impact",0)))

#     result = generate_suggestions(clean_phrases, star)

#     return result


















# IMPROVEMENT_MAP = {
#     "chậm":                 "Tăng cường đào tạo lại kỹ năng phục vụ cho nhân viên, đồng thời sắp xếp nhân sự và quy trình làm việc hợp lý trong giờ cao điểm để giảm thời gian chờ của khách.",
#     "lâu":                  "Tối ưu quy trình chế biến và phục vụ để rút ngắn thời gian chờ món của khách hàng.",
#     "ồn":                   "Giảm mức âm thanh và bố trí thêm vật liệu cách âm để hạn chế tiếng ồn, giúp không gian yên tĩnh và tạo cảm giác thoải mái hơn cho khách hàng.",
#     "cao":                  "Điều chỉnh mức giá hợp lý hơn hoặc nâng cao chất lượng món ăn và dịch vụ để phù hợp với giá tiền khách hàng bỏ ra.",
#     "nguội":                "Sử dụng dụng cụ giữ nhiệt hoặc đậy nắp món ăn khi mang ra, đồng thời cải thiện quy trình phục vụ để đảm bảo món ăn vẫn nóng khi đến tay khách hàng.",
#     "kém":                  "Đào tạo lại kỹ năng và thái độ phục vụ của nhân viên để nâng cao chất lượng phục vụ khách hàng.",
    
#     "ánh_sáng":             "Tăng cường hệ thống chiếu sáng hoặc bổ sung thêm đèn để không gian sáng hơn, tạo cảm giác thoải mái và dễ chịu cho khách hàng.",
#     "không tươi":           "Tăng cường kiểm tra chất lượng rau củ khi nhập hàng, sử dụng nguyên liệu trong ngày và bảo quản đúng cách để đảm bảo độ tươi của món ăn.",
    
#     "ít hỗ_trợ":            "Nhắc nhở và phân công nhân viên thường xuyên quan sát, chủ động hỗ trợ khách hàng kịp thời để nâng cao chất lượng phục vụ.",
#     "trình_bày kém":        "Cải thiện cách trình bày món ăn bằng cách phân chia khẩu phần hợp lý và sắp xếp món ăn cân đối để món ăn trông đẹp mắt và hấp dẫn hơn.",
    
#     "chưa có nổi_bật":      "Tạo thêm điểm nhấn trong món ăn, không gian hoặc phong cách phục vụ để mang lại trải nghiệm ấn tượng hơn cho khách hàng.",
#     "nhắc lại yêu cầu":     "Tăng cường nhắc nhở và đào tạo nhân viên lắng nghe yêu cầu của khách, đồng thời cải thiện quy trình ghi nhận order để hạn chế việc khách phải nhắc lại nhiều lần.",
    
#     "bí":                   "Sắp xếp lại bàn ghế hợp lý để không gian quán trở nên thoáng hơn và tạo cảm giác dễ chịu cho khách hàng.",
    
#     "cứng":                 "Điều chỉnh hoặc thay thế ghế có thiết kế êm ái hơn, đồng thời bổ sung đệm ngồi để mang lại cảm giác thoải mái cho khách hàng khi ngồi lâu, ví dụ như ghế bọc da, ghế có tựa lưng êm hoặc ghế có lót nệm dày.",
    
#     "tệ":                   "Rà soát lại quy trình phục vụ, chất lượng món ăn, không gian và thái độ của nhân viên để khắc phục các vấn đề và nâng cao trải nghiệm của khách hàng.",
#     "trải nghiệm chưa tốt": "Rà soát lại quy trình phục vụ, chất lượng món ăn, không gian và thái độ của nhân viên để khắc phục các vấn đề và nâng cao trải nghiệm của khách hàng.",
    
#     "thiếu nhiệt_tình":     "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
#     "nhân_viên khó_chịu":   "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
#     "không thân_thiện":     "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
#     "thờ_ơ":                "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
    
#     "khó_chịu":             "Kiểm tra và cải thiện hệ thống thông gió, đồng thời vệ sinh không gian thường xuyên để hạn chế mùi khó chịu trong quán.",
#     "ăn_không thoải_mái":   "Kiểm tra và cải thiện hệ thống thông gió, đồng thời vệ sinh không gian thường xuyên để hạn chế mùi khó chịu trong quán.",
    
#     "trung_bình":           "Cải thiện chất lượng món ăn, nguyên liệu và cách phục vụ để mang lại trải nghiệm tốt hơn cho khách hàng.",
#     "không như mong_đợi":   "Cải thiện chất lượng món ăn, nguyên liệu, cách phục vụ và không gian để mang lại trải nghiệm tốt hơn cho khách hàng.",
    
#     "chưa ấn_tượng":        "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "không ngon":           "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "ăn_không ngon":        "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "không quá đặc_sắc":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "đồ ăn bình_thường":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "nêm chưa vừa_miệng":   "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "không hợp_khẩu_vị":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
#     "chưa thật_sự ấn_tượng": "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng."
    
# }

# SYNONYM_MAP = {
#     "chậm": ["đợi lâu", "chờ lâu", "mất thời gian", "phục_vụ chậm"],
#     "lâu": ["đợi lâu", "chờ lâu", "mất thời gian"],
#     "ồn": ["ồn ào", "nhiều tiếng", "khá ồn", "hơi ồn"],
#     "bí": ["chật", "ngột ngạt", "không thoáng", "thiếu thoải_mái"],
#     "cứng": ["ngồi_không thoải_mái"],
#     "cao": ["đắt", "hơi mắc", "giá mắc"],
#     "nguội": ["không nóng", "đồ ăn nguội", "món nguội", "lạnh"],
#     "kém": ["không tốt", "tệ", "chất lượng kém"],
#     "khó_chịu": ["mùi khó_chịu", "mùi hôi"],
#     "không ngon": ["dở", "không hợp_khẩu_vị", "nhạt", "không hấp_dẫn", "khó cảm_nhận hương_vị", "thiếu sáng_tạo", "thiếu điểm nhấn", "không để ấn_tượng"],
#     "không như mong_đợi": ["không thực_sự hài_lòng"],

# }

# embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# # Tiền tính embedding cơ sở MỘT LẦN DUY NHẤT khi khởi động server
# PROBLEM_LABELS = list(IMPROVEMENT_MAP.keys())
# PROBLEM_EMBEDDINGS = embedding_model.encode(PROBLEM_LABELS, normalize_embeddings=True)

# # Ngưỡng chấp nhận, giá trị chuẩn cho MiniLM
# SIMILARITY_THRESHOLD = 0.65

# def generate_suggestions(salient_phrases, star):
#     """
#     Semantic Projection Recommendation Generation
#     Chuẩn học thuật, không keyword matching, không synonym map.

#     Args:
#         salient_phrases: list[(phrase, impact_score)] kết quả từ attribution
#         star: predicted star rating
#     """

#     # Bỏ qua hoàn toàn nếu 5 sao
#     if star == 5:
#         return {"improvements": []}

#     total_weight = defaultdict(float)

#     # Với mỗi cụm từ quan trọng mà mô hình đã tìm ra
#     for phrase, impact in salient_phrases:

#         # Bỏ qua cụm từ không đáng kể
#         if abs(impact) < 0.01:
#             continue

#         # Tính embedding của cụm từ này
#         phrase_emb = embedding_model.encode(phrase, normalize_embeddings=True)

#         # Tính độ tương đồng ngữ nghĩa với tất cả vấn đề cơ sở
#         similarity = cosine_similarity([phrase_emb], PROBLEM_EMBEDDINGS)[0]

#         # Lấy gần nhất trên ngưỡng chấp nhận
#         for idx, sim in sorted(enumerate(similarity), key=lambda x: -x[1]):
#             if sim < SIMILARITY_THRESHOLD:
#                 break

#             problem = PROBLEM_LABELS[idx]
            
#             # ✅ CỘNG TRỌNG SỐ THEO ĐỘ ẢNH HƯỞNG
#             # Cụm từ quan trọng hơn đóng góp nhiều hơn
#             total_weight[problem] += abs(impact) * sim

#             # Chỉ lấy gần nhất mỗi cụm từ
#             break


#     # Sắp xếp theo tổng trọng số giảm dần
#     ranked = sorted(total_weight.items(), key=lambda x: -x[1])

#     # Ánh xạ sang biện pháp cải thiện
#     improvements = [
#         IMPROVEMENT_MAP[problem]
#         for problem, weight in ranked
#     ]

#     # Logic cắt theo sao giữ nguyên như cũ
#     if star <= 2:
#         return {"improvements": improvements[:3]}
#     elif star == 3:
#         return {"improvements": improvements[:2]}
#     elif star == 4:
#         return {"improvements": improvements[:1]}
#     else:
#         return {"improvements": []}


# @router.post("/reviews/suggest")
# def suggest(data: dict):
#     phrases = data.get("phrases", [])
#     star = data.get("star", 3)

#     # đảm bảo đúng format
#     clean_phrases = []

#     for p in phrases:
#         if isinstance(p, list) and len(p) == 2:
#             clean_phrases.append((p[0], p[1]))
#         elif isinstance(p, dict):
#             clean_phrases.append((p.get("phrase",""), p.get("impact",0)))

#     result = generate_suggestions(clean_phrases, star)

#     return result










# =====================================================
# 1. RULE-BASED IMPROVEMENT MAP
# =====================================================

IMPROVEMENT_MAP = {
    "chậm":                 "Tăng cường đào tạo lại kỹ năng phục vụ cho nhân viên, đồng thời sắp xếp nhân sự và quy trình làm việc hợp lý trong giờ cao điểm để giảm thời gian chờ của khách.",
    "lâu":                  "Tối ưu quy trình chế biến và phục vụ để rút ngắn thời gian chờ món của khách hàng.",
    "ồn":                   "Giảm mức âm thanh và bố trí thêm vật liệu cách âm để hạn chế tiếng ồn, giúp không gian yên tĩnh và tạo cảm giác thoải mái hơn cho khách hàng.",
    "cao":                  "Điều chỉnh mức giá hợp lý hơn hoặc nâng cao chất lượng món ăn và dịch vụ để phù hợp với giá tiền khách hàng bỏ ra.",
    "nguội":                "Sử dụng dụng cụ giữ nhiệt hoặc đậy nắp món ăn khi mang ra, đồng thời cải thiện quy trình phục vụ để đảm bảo món ăn vẫn nóng khi đến tay khách hàng.",
    "kém":                  "Đào tạo lại kỹ năng và thái độ phục vụ của nhân viên để nâng cao chất lượng phục vụ khách hàng.",
    
    "ánh_sáng":             "Tăng cường hệ thống chiếu sáng hoặc bổ sung thêm đèn để không gian sáng hơn, tạo cảm giác thoải mái và dễ chịu cho khách hàng.",
    "không tươi":           "Tăng cường kiểm tra chất lượng rau củ khi nhập hàng, sử dụng nguyên liệu trong ngày và bảo quản đúng cách để đảm bảo độ tươi của món ăn.",
    
    "ít hỗ_trợ":            "Nhắc nhở và phân công nhân viên thường xuyên quan sát, chủ động hỗ trợ khách hàng kịp thời để nâng cao chất lượng phục vụ.",
    "trình_bày kém":        "Cải thiện cách trình bày món ăn bằng cách phân chia khẩu phần hợp lý và sắp xếp món ăn cân đối để món ăn trông đẹp mắt và hấp dẫn hơn.",
    
    "chưa có nổi_bật":      "Tạo thêm điểm nhấn trong món ăn, không gian hoặc phong cách phục vụ để mang lại trải nghiệm ấn tượng hơn cho khách hàng.",
    "nhắc lại yêu cầu":     "Tăng cường nhắc nhở và đào tạo nhân viên lắng nghe yêu cầu của khách, đồng thời cải thiện quy trình ghi nhận order để hạn chế việc khách phải nhắc lại nhiều lần.",
    
    "bí":                   "Sắp xếp lại bàn ghế hợp lý để không gian quán trở nên thoáng hơn và tạo cảm giác dễ chịu cho khách hàng.",
    
    "cứng":                 "Điều chỉnh hoặc thay thế ghế có thiết kế êm ái hơn, đồng thời bổ sung đệm ngồi để mang lại cảm giác thoải mái cho khách hàng khi ngồi lâu, ví dụ như ghế bọc da, ghế có tựa lưng êm hoặc ghế có lót nệm dày.",
    
    "tệ":                   "Rà soát lại quy trình phục vụ, chất lượng món ăn, không gian và thái độ của nhân viên để khắc phục các vấn đề và nâng cao trải nghiệm của khách hàng.",
    "trải nghiệm chưa tốt": "Rà soát lại quy trình phục vụ, chất lượng món ăn, không gian và thái độ của nhân viên để khắc phục các vấn đề và nâng cao trải nghiệm của khách hàng.",
    
    "thiếu nhiệt_tình":     "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
    "nhân_viên khó_chịu":   "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
    "không thân_thiện":     "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
    "thờ_ơ":                "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên để phục vụ khách hàng thân thiện và chuyên nghiệp hơn.",
    
    "khó_chịu":             "Kiểm tra và cải thiện hệ thống thông gió, đồng thời vệ sinh không gian thường xuyên để hạn chế mùi khó chịu trong quán.",
    "ăn_không thoải_mái":   "Kiểm tra và cải thiện hệ thống thông gió, đồng thời vệ sinh không gian thường xuyên để hạn chế mùi khó chịu trong quán.",
    
    "trung_bình":           "Cải thiện chất lượng món ăn, nguyên liệu và cách phục vụ để mang lại trải nghiệm tốt hơn cho khách hàng.",
    "không như mong_đợi":   "Cải thiện chất lượng món ăn, nguyên liệu, cách phục vụ và không gian để mang lại trải nghiệm tốt hơn cho khách hàng.",
    
    "chưa ấn_tượng":        "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
    "không ngon":           "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
    "ăn_không ngon":        "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
    "không quá đặc_sắc":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
    "đồ ăn bình_thường":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
    "nêm chưa vừa_miệng":   "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
    "không hợp_khẩu_vị":    "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng.",
    "chưa thật_sự ấn_tượng": "Điều chỉnh công thức và nâng cao chất lượng chế biến để hương vị món ăn trở nên đậm đà và hấp dẫn hơn đối với khách hàng."
    
}

# =====================================================
# 2. SYNONYM MAP
# =====================================================

SYNONYM_MAP = {
    "chậm": ["đợi lâu", "chờ lâu", "mất thời gian", "phục_vụ chậm"],
    "lâu": ["đợi lâu", "chờ lâu", "mất thời gian"],
    "ồn": ["ồn ào", "nhiều tiếng", "khá ồn", "hơi ồn"],
    "bí": ["chật", "ngột_ngạt", "không thoáng", "thiếu thoải_mái"],
    "cứng": ["ngồi_không thoải_mái"],
    "cao": ["đắt", "hơi mắc", "giá mắc"],
    "nguội": ["không nóng", "đồ ăn nguội", "món nguội", "lạnh"],
    "kém": ["không tốt", "tệ", "chất lượng kém"],
    "khó_chịu": ["mùi khó_chịu", "mùi hôi"],
    "không ngon": ["dở", "không hợp_khẩu_vị", "nhạt", "không hấp_dẫn", "khó cảm_nhận hương_vị", "thiếu sáng_tạo", "thiếu điểm nhấn", "không để ấn_tượng"],
    "không như mong_đợi": ["không thực_sự hài_lòng"],

}

# =====================================================
# 3. KNOWLEDGE BASE
# =====================================================

IMPROVEMENT_KB = [

{"aspect": "service",
 "problem": "phục vụ chậm",
 "solution": "Tăng cường đào tạo kỹ năng phục vụ và tối ưu quy trình phục vụ trong giờ cao điểm."},

{"aspect": "service",
 "problem": "nhân viên thiếu nhiệt tình",
 "solution": "Đào tạo lại thái độ và kỹ năng giao tiếp của nhân viên."},

{"aspect": "food",
 "problem": "món ăn không ngon",
 "solution": "Điều chỉnh công thức và nâng cao chất lượng chế biến."},

{"aspect": "food",
 "problem": "nguyên liệu không tươi",
 "solution": "Kiểm tra chất lượng nguyên liệu khi nhập hàng."},

{"aspect": "atmosphere",
 "problem": "không gian ồn",
 "solution": "Giảm âm lượng nhạc và bố trí vật liệu cách âm."},

{"aspect": "atmosphere",
 "problem": "không gian bí",
 "solution": "Cải thiện hệ thống thông gió và bố trí bàn ghế hợp lý."},

{"aspect": "atmosphere",
 "problem": "ghế ngồi không thoải mái",
 "solution": "Thay thế ghế hoặc bổ sung đệm ngồi."},

{"aspect": "price",
 "problem": "giá cao",
 "solution": "Điều chỉnh mức giá hợp lý hơn hoặc tăng giá trị dịch vụ."}
]


# =====================================================
# 4. LOAD EMBEDDING MODEL
# =====================================================

embedding_model = SentenceTransformer(
    "paraphrase-multilingual-MiniLM-L12-v2"
)


# =====================================================
# 5. PRECOMPUTE PROBLEM EMBEDDINGS
# =====================================================

PROBLEM_LABELS = [item["problem"] for item in IMPROVEMENT_KB]

PROBLEM_EMBEDDINGS = embedding_model.encode(
PROBLEM_LABELS,
normalize_embeddings=True
)

PROBLEM_EMBEDDINGS = np.array(PROBLEM_EMBEDDINGS).astype("float32")


# =====================================================
# 6. BUILD ASPECT INDEX
# =====================================================

ASPECT_INDEX = defaultdict(list)

for i, item in enumerate(IMPROVEMENT_KB):
    ASPECT_INDEX[item["aspect"]].append(i)


# =====================================================
# 7. ASPECT DETECTION
# =====================================================

ASPECTS = ["service", "food", "price", "atmosphere"]

ASPECT_EMBEDDINGS = embedding_model.encode(
ASPECTS,
normalize_embeddings=True
)

ASPECT_EMBEDDINGS = np.array(ASPECT_EMBEDDINGS).astype("float32")


def detect_aspect(phrase_emb):

    sims = cosine_similarity(
        phrase_emb.reshape(1,-1),
        ASPECT_EMBEDDINGS
    )[0]

    idx = np.argmax(sims)

    return ASPECTS[idx]


# =====================================================
# 8. SEMANTIC SEARCH
# =====================================================

SIM_THRESHOLD = 0.6


def semantic_search(phrase_emb, aspect, top_k=3):

    indices = ASPECT_INDEX.get(aspect, [])

    if not indices:
        return []

    sub_embeddings = PROBLEM_EMBEDDINGS[indices]

    scores = cosine_similarity(sub_embeddings, phrase_emb).flatten()

    top_ids = np.argsort(scores)[::-1][:top_k]

    results = []

    for idx in top_ids:

        real_idx = indices[idx]

        results.append({
            "problem": PROBLEM_LABELS[real_idx],
            "solution": IMPROVEMENT_KB[real_idx]["solution"],
            "score": float(scores[idx])
        })

    return results


# =====================================================
# 9. HYBRID SUGGESTION ENGINE
# =====================================================

def generate_suggestions(salient_phrases, star):

    if star == 5:
        return {"improvements": []}

    total_weight = defaultdict(float)

    phrases = [p for p,_ in salient_phrases]

    phrase_embeddings = embedding_model.encode(
        phrases,
        normalize_embeddings=True
    )

    for (phrase, impact), phrase_emb in zip(salient_phrases, phrase_embeddings):

        phrase_lower = phrase.lower()

        weight_base = abs(impact)

        if weight_base < 0.05:
            weight_base = 0.2

        matched = False


        # KEYWORD MATCH
        for keyword, solution in IMPROVEMENT_MAP.items():

            if keyword in phrase_lower:

                total_weight[solution] += weight_base
                matched = True
                break


        # SYNONYM MATCH
        if not matched:

            for keyword, synonyms in SYNONYM_MAP.items():

                for syn in synonyms:

                    if syn in phrase_lower:

                        if keyword in IMPROVEMENT_MAP:

                            solution = IMPROVEMENT_MAP[keyword]

                            total_weight[solution] += weight_base * 0.9

                            matched = True
                            break

                if matched:
                    break


        # SEMANTIC SEARCH
        if not matched:

            phrase_emb = np.array(phrase_emb).astype("float32").reshape(1,-1)

            aspect = detect_aspect(phrase_emb)

            candidates = semantic_search(phrase_emb, aspect)

            for cand in candidates:

                sim = cand["score"]

                if sim < SIM_THRESHOLD:
                    continue

                solution = cand["solution"]

                total_weight[solution] += weight_base * sim

                break


    ranked = sorted(
        total_weight.items(),
        key=lambda x: -x[1]
    )

    results = [

        {
            "solution": sol,
            "confidence": round(float(w),3)
        }

        for sol,w in ranked

    ]

    return {"improvements": results[:3]}


# =====================================================
# 10. API ENDPOINT
# =====================================================

@router.post("/reviews/suggest")
def suggest(data: dict):

    phrases = data.get("phrases", [])
    star = data.get("star", 3)

    clean_phrases = []

    for p in phrases:

        if isinstance(p, list) and len(p) == 2:
            clean_phrases.append((p[0], p[1]))

        elif isinstance(p, dict):
            clean_phrases.append(
                (p.get("phrase",""), p.get("impact",0))
            )

    return generate_suggestions(clean_phrases, star)
    
    