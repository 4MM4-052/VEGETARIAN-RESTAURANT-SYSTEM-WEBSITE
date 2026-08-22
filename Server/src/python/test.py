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

    raw_phrases = extract_model_guided_phrases(text, lvl1, lvl2a, lvl2b)

    # Không remove_overlapping_phrases
    raw_phrases.sort(key=lambda x: abs(x[1]), reverse=True)

    selected_phrases = raw_phrases[:3]
    
    
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
        "phrases": formatted_phrases
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

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   # predictor.py
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModel
from pyvi import ViTokenizer
import re

import logging
logger = logging.getLogger(__name__)
# THÊM SAU IMPORT LOGGING
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("explain_debug.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
logger.info("="*60)
logger.info("Review Explainability Service Started")
logger.info("="*60)

# Thêm constants với comment
MIN_IMPACT_THRESHOLD = 0.01  # Lọc bỏ phrase có impact < 5% tổng thay đổi
MAX_PHRASES_RETURNED = 5     # Trả về top-5 phrases quan trọng nhất
PHRASE_LENGTH_RANGE = (1, 3) # N-gram từ 1 đến 3 từ

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MAX_LEN = 128

tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
model = AutoModel.from_pretrained(
    "vinai/phobert-base",
    output_hidden_states=True
)
model.to(DEVICE)
model.eval()

stopphrases = set([
    # đại từ – từ chỉ định
    "tôi","mình","ta","chúng","chúng_tôi","bạn","anh","chị","em",
    "họ","nó","ai","gì","đây","kia","ấy","đó",

    # giới từ – liên từ
    "với","về","từ","đến","trong","ngoài","giữa","sau","trước",
    "bởi","do","vì","nên","mà","hay","hoặc","thì","lại",

    # trợ từ – hư từ
    "đang","sẽ","đã","vừa","mới","rồi","nữa","chỉ",
    "lắm","nhiều","còn","đều","đều_đều",

    # từ phổ biến nhưng ít mang sentiment
    "sản_phẩm","dịch_vụ","shop","cửa_hàng","mua","bán",
    "đặt","nhận","giao","ship","gửi","lấy","xài","dùng",
    "hàng","order","feedback","review",

    # số lượng / thời gian
    "ngày","giờ","lần","tháng","tuần","năm",
    "hôm_nay","hôm_qua","mai","nay",

    # từ tình thái
    "ạ","à","ơi","nhé","nhỉ","ha","nha","luôn"
])

abbreviation_dict = {
    # phủ định
    "ko": "không", "k": "không", "kh": "không", "kg": "không",
    "hok": "không", "hem": "không",
    "ch": "chưa", "chx": "chưa",

    "dc": "được", "đc": "được",

    # con người – dịch vụ
    "nv": "nhân viên", "ng": "người", "khach": "khách hàng", "ql": "quản lý",
    "pv": "phục vụ", "bh": "bán hàng", "cs": "chăm sóc",

    # cảm nhận – chất lượng
    "ok": "tốt", "oke": "tốt", "okela": "tốt", "okla": "tốt",
    "xịn": "tốt", "xịn_xò": "tốt", "xịn_sò": "tốt",
    "ổn": "tốt", "ổn_áp": "tốt",

    "bt": "bình thường", "tạm": "bình thường",

    "fail": "tệ", "chán": "tệ",

    "dở": "không ngon",
    "ko_ngon": "không ngon",
    "ngán": "không ngon",

}

POS_5STAR_PHRASES = {
    "quá ngon": 1.5,
    "rất ngon": 1.4,
    "cực kỳ ngon": 1.6,
    "xuất sắc": 1.6,
    "tuyệt vời": 1.6,
    "hoàn hảo": 1.7,
    "đỉnh": 1.4,
    "đỉnh của chóp": 1.8,
    "rất hài lòng": 1.5,
    "xứng đáng": 1.4,
    "rất tốt": 1.3,
    "đáng tiền": 1.4
}

# Viết tắt
def normalize_abbreviations(text):
    words = text.split()
    words = [abbreviation_dict.get(w, w) for w in words]
    return " ".join(words)

# Chữ kéo dài
def normalize_elongated_words(text):
    # Giảm các ký tự lặp liên tiếp >2 về còn 1
    text = re.sub(r'(.)\1{2,}', r'\1', text)
    return text

def preprocess_text(text):
    text = str(text).lower()

    # 1. Chuẩn hóa từ viết tắt & tiếng lóng
    text = normalize_abbreviations(text)

    # 2. Loại bỏ ký tự đặc biệt (giữ dấu tiếng Việt)
    text = re.sub(
        r"[^a-zA-Z0-9\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]",
        "",
        text
    )

    # 3. Chuẩn hóa chữ kéo dài
    text = normalize_elongated_words(text)

    # 4. Tách từ tiếng Việt
    text = ViTokenizer.tokenize(text)

    # 5. Loại bỏ stopwords
    text = " ".join([w for w in text.split() if w not in stopphrases])

    return text

def get_embedding(text: str):
    with torch.no_grad():
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=MAX_LEN
        ).to(DEVICE)

        outputs = model(**inputs)
        hidden = torch.stack(outputs.hidden_states[-4:]).mean(0)
        mask = inputs["attention_mask"].unsqueeze(-1)
        emb = (hidden * mask).sum(1) / mask.sum(1)
        return emb.cpu().numpy()

def detect_5star_phrases(text):
    score = 0.0
    for p, w in POS_5STAR_PHRASES.items():
        if p.replace(" ", "_") in text:
            score += w
    return score

def decide_level1(p_neg, p_neu, p_pos, th=0.55):
    if p_pos >= th and p_pos > p_neg:
        return "POS"
    if p_neg >= th and p_neg > p_pos:
        return "NEG"
    return "NEU"

def infer_star_from_proba(p_neg, p_neu, p_pos):

    # ===== NEGATIVE =====
    if p_neg >= max(p_neu, p_pos):
        if p_neg >= 0.80:
            return 1
        elif p_neg >= 0.55:
            return 2
        else:
            return 3

    # ===== POSITIVE =====
    if p_pos >= max(p_neu, p_neg):
        if p_pos >= 0.80:
            return 5
        elif p_pos >= 0.55:
            return 4
        else:
            return 3

    # ===== NEUTRAL =====
    return 3



# Thêm nhiều từ khóa hơn cho từng mức sao
POSITIVE_WORDS = [
    "tốt", "ngon", "tuyệt", "hài lòng", "ổn", "đẹp", "nhanh", "chu đáo", 
    "sạch", "thoải mái", "ấn tượng", "chill", "tươi", "ngon miệng", "hỗ trợ tốt"
]

NEGATIVE_WORDS = [
    "tệ", "dở", "chậm", "kém", "thất vọng", "xấu", "không hài lòng", 
    "bí", "khó chịu", "ồn", "không thoải mái", "không ấn tượng", "lạnh", 
    "tối", "cứng", "mùi khó chịu", "kém chất lượng"
]

# Cập nhật hàm extract_keywords để hỗ trợ nhiều mức sao
from lime.lime_text import LimeTextExplainer
import numpy as np

explainer = LimeTextExplainer(
    class_names=["1 sao","2 sao","3 sao","4 sao","5 sao"]
)

def extract_keywords(text, star, lvl1, lvl2a, lvl2b, top_k=5):

    def predict_star_proba(texts):
        probs = []

        for t in texts:
            clean = preprocess_text(t)
            emb = get_embedding(clean)

            p1 = lvl1.predict_proba(emb)[0]
            pmap = dict(zip(lvl1.classes_, p1))

            sentiment = decide_level1(
                pmap.get("NEG", 0),
                pmap.get("NEU", 0),
                pmap.get("POS", 0)
            )

            star_probs = np.zeros(5)

            if sentiment == "NEG":
                p2 = lvl2a.predict_proba(emb)[0]
                for cls, p in zip(lvl2a.classes_, p2):
                    star_probs[int(cls) - 1] = p

            elif sentiment == "POS":
                p2 = lvl2b.predict_proba(emb)[0]
                for cls, p in zip(lvl2b.classes_, p2):
                    star_probs[int(cls) - 1] = p

            else:
                star_probs[2] = 1.0

            s = star_probs.sum()
            if s == 0:
                star_probs[star - 1] = 1.0
            else:
                star_probs /= s

            probs.append(star_probs)

        return np.array(probs)

    exp = explainer.explain_instance(
        text[:300],
        predict_star_proba,
        labels=[star - 1],
        num_features=top_k,
        num_samples=500
    )

    keywords = [
        {"word": w, "weight": round(score, 3)}
        for w, score in exp.as_list(label=star - 1)
    ]

    return keywords or [{"word": "Không xác định rõ", "weight": 0.0}]






# def predict(review, lvl1, lvl2a, lvl2b, return_confidence=False):
#     clean = preprocess_text(review)
#     emb = get_embedding(clean)

#     # ===== LEVEL 1 =====
#     proba = lvl1.predict_proba(emb)[0]
#     pmap = dict(zip(lvl1.classes_, proba))

#     p_neg = pmap.get("NEG", 0)
#     p_neu = pmap.get("NEU", 0)
#     p_pos = pmap.get("POS", 0)

#     sentiment = decide_level1(p_neg, p_neu, p_pos)

#     # ===== NEGATION PENALTY =====
#     if re.search(r"\b(không|chưa|chẳng|ko|kh)\b", clean):
#         p_pos *= 0.7
#         p_neg *= 1.1

#     # ===== LEVEL 2 =====
#     if sentiment == "NEG":
#         p2 = lvl2a.predict_proba(emb)[0]
#         star = int(lvl2a.classes_[np.argmax(p2)])

#     elif sentiment == "POS":
#         p2 = lvl2b.predict_proba(emb)[0]
#         star = int(lvl2b.classes_[np.argmax(p2)])

#         # boost 5★ nếu có phrase mạnh
#         if detect_5star_phrases(clean) >= 1.3:
#             star = 5

#     else: 
#           star = 3


#     return star
def predict(review, lvl1, lvl2a, lvl2b, return_proba=False):
    clean = preprocess_text(review)
    emb = get_embedding(clean)

    # ===== LEVEL 1 =====
    p1 = lvl1.predict_proba(emb)[0]
    pmap = dict(zip(lvl1.classes_, p1))

    sentiment = decide_level1(
        pmap.get("NEG", 0),
        pmap.get("NEU", 0),
        pmap.get("POS", 0)
    )

    star_probs = np.zeros(5)

    if sentiment == "NEG":
        p2 = lvl2a.predict_proba(emb)[0]
        for cls, p in zip(lvl2a.classes_, p2):
            star_probs[int(cls)-1] = p

    elif sentiment == "POS":
        p2 = lvl2b.predict_proba(emb)[0]
        for cls, p in zip(lvl2b.classes_, p2):
            star_probs[int(cls)-1] = p

        if detect_5star_phrases(clean) >= 1.3:
            star_probs[4] += 0.1

    else:
        star_probs[2] = 1.0

    star_probs = star_probs / (star_probs.sum() + 1e-9)
    star = int(np.argmax(star_probs) + 1)

    if return_proba:
        return star, star_probs

    return star




def tokenize(text):
    text = preprocess_text(text)
    return text.split()

def mask_phrase(text, phrase):
    return re.sub(
        r"\b" + re.escape(phrase) + r"\b",
        "",
        text,
        count=1
    )
def explain_preprocess(text):
    return preprocess_text(text)
def is_valid_phrase(phrase):
    words = phrase.split()
    # 1. Cho phép từ đơn (len >= 1)
    if len(words) < 1: 
        return False
    
    # 2. Nếu là từ đơn, phải không nằm trong danh sách stopword
    if len(words) == 1:
        if words[0] in stopphrases:
            return False
            
    # 3. Nếu là cụm từ, không được chứa toàn bộ là stopword
    if all(w in stopphrases for w in words):
        return False
        
    return True

def predict_star_proba(clean_text, lvl1, lvl2a, lvl2b):

    emb = get_embedding(clean_text)

    # Level 1 sentiment probabilities
    p1 = lvl1.predict_proba(emb)[0]
    pmap = dict(zip(lvl1.classes_, p1))

    p_neg = pmap.get("NEG", 0)
    p_neu = pmap.get("NEU", 0)
    p_pos = pmap.get("POS", 0)

    star_probs = np.zeros(5)

    # NEG branch (1-2 star)
    p2_neg = lvl2a.predict_proba(emb)[0]
    for cls, p in zip(lvl2a.classes_, p2_neg):
        star_probs[int(cls) - 1] += p_neg * p

    # POS branch (4-5 star)
    p2_pos = lvl2b.predict_proba(emb)[0]
    for cls, p in zip(lvl2b.classes_, p2_pos):
        star_probs[int(cls) - 1] += p_pos * p

    # NEU contributes to 3-star
    star_probs[2] += p_neu

    # Normalize
    star_probs = star_probs / np.sum(star_probs)

    return star_probs


def extract_candidate_phrases(clean_text):
    """
    Trích xuất candidate phrases từ text.
    
    ⚠️ QUAN TRỌNG: Text phải đã được ViTokenizer xử lý!
    Ví dụ: "Trải nghiệm tuyệt vời" → "Trải_nghiệm tuyệt_vời"
    
    Khi split() sẽ được ["Trải_nghiệm", "tuyệt_vời"]
    """
    
    tokens = clean_text.split()
    phrases = []
    
    # N-gram từ 2 đến 3
    for n in [2, 3]:
        for i in range(len(tokens) - n + 1):
            phrase = " ".join(tokens[i:i+n])
            if is_valid_phrase(phrase):
                phrases.append(phrase)
    
    # Bỏ duplicate
    phrases = list(dict.fromkeys(phrases))
    
    logger.info(f"[CANDIDATES] Found {len(phrases)} phrases from {len(tokens)} tokens")
    logger.debug(f"Tokens: {tokens}")
    logger.debug(f"Phrases: {phrases[:10]}")  # In top-10
    
    return phrases

def ablation_score(clean_text, phrase, lvl1, lvl2a, lvl2b):

    p_full = predict_star_proba(clean_text, lvl1, lvl2a, lvl2b)
    original_star = np.argmax(p_full)

    pattern = r'\b' + re.escape(phrase) + r'\b'
    masked_text = re.sub(pattern, "", clean_text).strip()

    p_masked = predict_star_proba(masked_text, lvl1, lvl2a, lvl2b)

    impact = p_full[original_star] - p_masked[original_star]

    return float(impact)


def extract_model_guided_phrases(text, lvl1, lvl2a, lvl2b, top_k=6):
    clean_text = preprocess_text(text)
    if not clean_text:
        return []

    phrases = extract_candidate_phrases(clean_text)

    scored = []

    for phrase in phrases:
        score = ablation_score(clean_text, phrase, lvl1, lvl2a, lvl2b)

        # 🔥 giữ cả âm lẫn dương
        if abs(score) > 0:
            scored.append((phrase, round(score, 4)))

    # 🔥 sort theo độ ảnh hưởng tuyệt đối
    scored.sort(key=lambda x: abs(x[1]), reverse=True)

    print("ALL SCORED:", scored)

    return scored














