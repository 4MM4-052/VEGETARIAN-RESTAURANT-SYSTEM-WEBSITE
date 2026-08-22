# # main.py
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# from pydantic import BaseModel

# from model_loader import get_models
# from predictor import predict

# import pandas as pd
# import os
# from datetime import datetime

# # =====================================================
# # APP
# # =====================================================
# app = FastAPI(title="Review Star Prediction API")

# # =====================================================
# # CORS
# # =====================================================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3001",
#         # "http://localhost:3000",
#     ],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # =====================================================
# # MODEL CONFIG
# # =====================================================
# DEFAULT_CONFIG = {
#     "level1": "SVM",
#     "level2a": "Logistic",
#     "level2b": "SVM"
# }

# # =====================================================
# # REQUEST MODELS
# # =====================================================
# class ClientRequest(BaseModel):
#     review: str


# class AdminRequest(BaseModel):
#     review: str
#     config: dict


# class ReviewSaveRequest(BaseModel):
#     sender: str
#     content: str
#     star: int


# # =====================================================
# # CSV SETUP (ĐƯỜNG DẪN CỦA BẠN)
# # =====================================================
# CSV_FILE = r"D:\HuongSen_Project\Server\src\python\data\review.csv"

# # Tạo thư mục nếu chưa tồn tại
# os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)

# # Tạo file CSV nếu chưa có
# if not os.path.exists(CSV_FILE):
#     df = pd.DataFrame(columns=[
#         "Người gửi",
#         "Ngày review",
#         "Nội dung review",
#         "Số sao"
        
#     ])
#     df.to_csv(CSV_FILE, index=False, encoding="utf-8-sig")


# # =====================================================
# # ML PREDICT (CLIENT)
# # =====================================================
# @app.post("/predict")
# def predict_client(req: ClientRequest):
#     lvl1, lvl2a, lvl2b = get_models(DEFAULT_CONFIG)
#     star = predict(req.review, lvl1, lvl2a, lvl2b)
#     return {"star": star}


# # =====================================================
# # ML PREDICT (ADMIN)
# # =====================================================
# @app.post("/admin/predict")
# def predict_admin(req: AdminRequest):
#     config = {k: v.upper() for k, v in req.config.items()}
#     lvl1, lvl2a, lvl2b = get_models(config)

#     star = predict(req.review, lvl1, lvl2a, lvl2b)

#     return {
#         "review": req.review,
#         "model_used": config,
#         "predicted_star": star
#     }


# # =====================================================
# # SAVE REVIEW → CSV
# # =====================================================
# @app.post("/reviews")
# def save_review(data: ReviewSaveRequest):
#     new_row = {
#         "Người gửi": data.sender,
#         "Nội dung review": data.content,
#         "Số sao": data.star,
#         "Ngày review": datetime.now().strftime("%d/%m/%Y %H:%M:%S")
#     }

#     df = pd.read_csv(CSV_FILE, encoding="utf-8-sig")
#     df = pd.concat([pd.DataFrame([new_row]), df], ignore_index=True)
#     df.to_csv(CSV_FILE, index=False, encoding="utf-8-sig")

#     return {"message": "Review saved successfully"}


# # =====================================================
# # GET ALL REVIEWS
# # =====================================================
# @app.get("/reviews")
# def get_reviews():
#     df = pd.read_csv(CSV_FILE, encoding="utf-8-sig")
#     return df.to_dict(orient="records")


# # =====================================================
# # DOWNLOAD CSV
# # =====================================================
# @app.get("/reviews/csv")
# def download_reviews_csv():
#     return FileResponse(
#         CSV_FILE,
#         media_type="text/csv",
#         filename="review.csv"
#     )



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from model_loader import get_models
from predictor import predict

import pandas as pd
import os
from datetime import datetime
from pandas.errors import EmptyDataError
from admin_routes import router as admin_router

# =====================================================
# APP
# =====================================================
app = FastAPI(title="Review Star Prediction API")

# =====================================================
# CORS (DEV)
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# MODEL CONFIG
# =====================================================
DEFAULT_CONFIG = {
    "level1": "SVM",
    "level2a": "SVM",
    "level2b": "SVM"
}

# =====================================================
# REQUEST MODELS
# =====================================================
class ClientRequest(BaseModel):
    review: str

class AdminRequest(BaseModel):
    review: str
    config: dict

class ReviewSaveRequest(BaseModel):
    sender: str
    content: str
    star: int

# =====================================================
# CSV SETUP
# =====================================================
CSV_FILE = r"D:\HuongSen_Project\Server\src\python\data\review.csv"
CSV_ENCODING = "utf-8-sig"   # ✅ CHUẨN TIẾNG VIỆT + EXCEL

os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)

if not os.path.exists(CSV_FILE):
    pd.DataFrame(columns=[
        "Người gửi",
        "Ngày review",
        "Nội dung review",
        "Số sao"
    ]).to_csv(CSV_FILE, index=False, encoding=CSV_ENCODING)

# =====================================================
# SAFE READ CSV
# =====================================================
def read_csv_safe():
    try:
        return pd.read_csv(CSV_FILE, encoding=CSV_ENCODING)
    except EmptyDataError:
        return pd.DataFrame(columns=[
            "Người gửi",
            "Ngày review",
            "Nội dung review",
            "Số sao"
        ])

# =====================================================
# ML PREDICT (CLIENT)
# =====================================================
@app.post("/predict")
def predict_client(req: ClientRequest):
    lvl1, lvl2a, lvl2b = get_models(DEFAULT_CONFIG)
    star = predict(req.review, lvl1, lvl2a, lvl2b)
    return {"star": star}


# =====================================================
# SAVE REVIEW
# =====================================================
@app.post("/reviews")


def save_review(data: ReviewSaveRequest):
    df = read_csv_safe()

    # 🧹 CHUẨN HOÁ + DIỆT NaT
    if "Ngày review" in df.columns and not df.empty:
        df["Ngày review"] = pd.to_datetime(
            df["Ngày review"],
            errors="coerce",
            dayfirst=True
        )

        # ❗ THAY NaT BẰNG THỜI GIAN HIỆN TẠI (hoặc chuỗi rỗng)
        df["Ngày review"] = df["Ngày review"].fillna(datetime.now())

        # ✅ FORMAT LẠI 24H
        df["Ngày review"] = df["Ngày review"].dt.strftime("%d/%m/%Y %H:%M:%S")

    # ➕ REVIEW MỚI
    new_row = pd.DataFrame([{
        "Người gửi": data.sender,
        "Ngày review": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "Nội dung review": data.content,
        "Số sao": data.star
    }])

    df = pd.concat([new_row, df], ignore_index=True)

    df.to_csv(CSV_FILE, index=False, encoding=CSV_ENCODING)

    return {"message": "Saved & normalized"}


# =====================================================
# GET REVIEWS
# =====================================================
@app.get("/reviews")
def get_reviews():
    df = read_csv_safe()

    # 🧹 DIỆT NaN / NaT / inf TRƯỚC KHI TRẢ JSON
    df = df.replace([float("inf"), float("-inf")], None)
    df = df.where(pd.notnull(df), None)

    # ✅ ĐẢM BẢO SỐ SAO LÀ INT (KHÔNG NaN)
    if "Số sao" in df.columns:
        df["Số sao"] = df["Số sao"].fillna(0).astype(int)

    return df.to_dict(orient="records")


# =====================================================
# DOWNLOAD CSV
# =====================================================
@app.get("/reviews/csv")
def download_csv():
    return FileResponse(
        CSV_FILE,
        media_type="text/csv",
        filename="review.csv"
    )
    
app.include_router(admin_router)