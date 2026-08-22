import re
from pyvi import ViTokenizer
from model_loader import get_models

# =====================
# STOPWORDS
# =====================
stopphrases = {
    "tôi","mình","ta","chúng","chúng_tôi","bạn","anh","chị","em",
    "họ","nó","ai","gì","đây","kia","ấy","đó",
    "với","về","từ","đến","trong","ngoài","giữa","sau","trước",
    "bởi","do","vì","nên","mà","hay","hoặc","thì","lại",
    "đang","sẽ","đã","vừa","mới","rồi","nữa","chỉ",
    "lắm","nhiều","còn","đều",
    "sản_phẩm","dịch_vụ","shop","cửa_hàng","mua","bán",
    "đặt","nhận","giao","ship","gửi","lấy","xài","dùng",
    "hàng","order","feedback","review",
    "ngày","giờ","lần","tháng","tuần","năm",
    "hôm_nay","hôm_qua","mai","nay",
    "ạ","à","ơi","nhé","nhỉ","ha","nha","luôn"
}

# =====================
# ABBREVIATION
# =====================
abbreviation_dict = {
    "ko":"không","k":"không","kh":"không","kg":"không","hok":"không",
    "dc":"được","đc":"được",
    "nv":"nhân viên","ng":"người","pv":"phục vụ",
    "ok":"tốt","oke":"tốt","xịn":"tốt","ổn":"tốt",
    "bt":"bình thường",
    "fail":"tệ","chán":"tệ",
    "dở":"không ngon","ngán":"không ngon"
}

# =====================
# POSITIVE PHRASES
# =====================
POS_5STAR_PHRASES = {
    "quá ngon": 1.5,
    "rất ngon": 1.4,
    "xuất sắc": 1.6,
    "tuyệt vời": 1.6,
    "hoàn hảo": 1.7,
    "đỉnh của chóp": 1.8,
    "rất hài lòng": 1.5
}

# =====================
# PREPROCESS
# =====================
def normalize_abbreviations(text):
    return " ".join(abbreviation_dict.get(w, w) for w in text.split())

def normalize_elongated_words(text):
    return re.sub(r'(.)\1{2,}', r'\1', text)

def preprocess_text(text):
    text = str(text).lower()
    text = normalize_abbreviations(text)

    text = re.sub(
        r"[^a-zA-Z0-9\sáàảãạăâêôơưđíìỉĩịóòỏõọúùủũụýỳỷỹỵ]",
        "",
        text
    )

    text = normalize_elongated_words(text)
    text = ViTokenizer.tokenize(text)
    text = " ".join(w for w in text.split() if w not in stopphrases)

    return text

# =====================
# RULE BOOST
# =====================
def detect_5star_phrases(text):
    score = 0.0
    hits = []
    for phrase, w in POS_5STAR_PHRASES.items():
        if phrase.replace(" ", "_") in text:
            score += w
            hits.append(phrase)
    return score, hits

# =====================
# MAIN PREDICT
# =====================
def predict_star(review_text, for_admin=False):
    lvl1_model, lvl2a_model, lvl2b_model = get_models()

    clean_text = preprocess_text(review_text)

    # ===== LEVEL 1 =====
    proba = lvl1_model.predict_proba([clean_text])[0]
    cls = lvl1_model.classes_
    proba_map = dict(zip(cls, proba))

    p_neg = proba_map.get("NEG", 0)
    p_pos = proba_map.get("POS", 0)

    if p_pos >= 0.55 and p_pos > p_neg:
        sentiment = "POS"
    elif p_neg >= 0.55:
        sentiment = "NEG"
    else:
        sentiment = "NEU"

    # ===== LEVEL 2 =====
    if sentiment == "NEG":
        star = int(lvl2a_model.predict([clean_text])[0])
    elif sentiment == "POS":
        star = int(lvl2b_model.predict([clean_text])[0])
        boost, _ = detect_5star_phrases(clean_text)
        if boost >= 1.5:
            star = 5
    else:
        star = 3

    if for_admin:
        return {
            "clean_text": clean_text,
            "sentiment": sentiment,
            "star": star,
            "proba": proba_map
        }

    return {"star": star}
