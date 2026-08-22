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

SENTIMENT_WORDS = [

    # ===== TÍCH CỰC =====
    "ngon", "đẹp", "ổn", "tốt",
    "sạch_sẽ", "nhanh", "hài_lòng",
    "lạ_miệng", "vừa_phải",
    "thoáng", "mát",
    "chuyên_nghiệp", "nhiệt_tình",
    "thân_thiện", "ấn_tượng",
    "tuyệt_vời", "thoải_mái",
    "chill", "hợp_lý",
    "đặc_sắc", "nổi_bật",
    "yên_tĩnh", "lịch_sự", "cực kỳ",
    "hương_vị", "đậm_đà", "tươi",
    "xứng_đáng", "số_tiền", "bỏ_ra",

    # ===== TRUNG TÍNH =====
    "trung_bình", "bình_thường",
    "tạm", "vừa_miệng",

    # ===== TIÊU CỰC =====
    "chậm", "lâu", "ồn", "tệ",
    "khó_chịu", "bí",
    "thiếu", "không", "chưa",
    "nguội", "tối", "kém",
    "cao", "cứng",
    "ít", "hỗ_trợ",
    "mong_đợi", 
    "lạnh", "nhạt", "thờ_ơ",
    "ngột_ngạt", 

    # ===== DANH TỪ QUAN TRỌNG =====
    "giá", "chất_lượng",

    # ===== HÀNH VI =====
    "quay_lại",
    "hợp_khẩu_vị"
]

def extract_clause_representative_phrase(clean_clause: str):

    tokens = clean_clause.split()
    candidates = []

    for i in range(len(tokens)):

        word = tokens[i]

        if word in SENTIMENT_WORDS:

            # lấy 2 từ trước và sau để tạo phrase tự nhiên
            start = max(0, i-2)
            end = min(len(tokens), i+3)

            phrase = " ".join(tokens[start:end])
            candidates.append(phrase)

    return list(set(candidates))

def ablation_score(clean_text, phrase, lvl1, lvl2a, lvl2b):

    p_full = predict_star_proba(clean_text, lvl1, lvl2a, lvl2b)
    original_star = np.argmax(p_full)

    pattern = r'\b' + re.escape(phrase) + r'\b'
    masked_text = re.sub(pattern, "", clean_text).strip()

    p_masked = predict_star_proba(masked_text, lvl1, lvl2a, lvl2b)

    impact = p_full[original_star] - p_masked[original_star]

    return float(impact)

def split_clauses(text: str):
    text = text.lower().strip()

    # 1️⃣ tách theo dấu câu lớn
    parts = re.split(r"[.!?;]+", text)

    clauses = []

    # 2️⃣ danh sách liên từ cần cắt
    connectors = [
        " nhưng ",
        " tuy nhiên ",
        " mặc dù ",
        " dù ",
        " song ",
        " tuy ",
        " và ",
        " với ",
        " cùng ",
        " thế nhưng ",
        " tuy vậy ",
        " trái lại "
    ]

    for part in parts:
        part = part.strip()
        if not part:
            continue

        # 3️⃣ tách theo dấu phẩy
        subparts = re.split(r",+", part)

        for sub in subparts:
            sub = sub.strip()
            if not sub:
                continue

            temp = [sub]

            # 4️⃣ tách tiếp theo liên từ
            for c in connectors:
                new_temp = []
                for t in temp:
                    if c in t:
                        pieces = t.split(c)
                        for p in pieces:
                            p = p.strip()
                            if p:
                                new_temp.append(p)
                    else:
                        new_temp.append(t)
                temp = new_temp

            clauses.extend(temp)

    return clauses

def extract_model_guided_phrases(text, lvl1, lvl2a, lvl2b, top_k=6):

    clauses = split_clauses(text)
    results = []

    for clause in clauses:

        clean_clause = preprocess_text(clause)
        if not clean_clause:
            continue

        phrases = extract_clause_representative_phrase(clean_clause)

        for phrase in phrases:
            score = ablation_score(clean_clause, phrase, lvl1, lvl2a, lvl2b)

            if abs(score) > 0:
                results.append((phrase, round(score, 4)))

    results.sort(key=lambda x: abs(x[1]), reverse=True)

    # remove duplicate
    seen = set()
    final = []
    for p, s in results:
        if p not in seen:
            seen.add(p)
            final.append((p, s))

    return final
