# # predict.py

# import numpy as np
# from tensorflow.keras.models import load_model
# from .config import MODEL_PATH
# from sklearn.preprocessing import StandardScaler
# import pickle # <--- ĐÃ THÊM: Import pickle


# # Cần load lại scaler và model khi service khởi động
# try:
#     # 1. Load Model
#     model = load_model(MODEL_PATH) 
    
#     # 2. Load Scaler
#     # SỬA ĐƯỜNG DẪN: Chỉ cần tên file vì predict.py và hour_scaler.pkl nằm cùng thư mục (main)
#     with open('hour_scaler.pkl', 'rb') as f: 
#         hour_scaler: StandardScaler = pickle.load(f)
#     print("AI Model và Scaler đã được tải thành công.")

# except Exception as e:
#     # Nếu lỗi, in chi tiết lỗi
#     print(f"LỖI KHÔNG THỂ TẢI MODEL HOẶC SCALER: {e}")
#     model = None
#     hour_scaler = None

# def predict_reservation(day: int, hour: int) -> float:
#     # ... (logic không đổi)
#     if model is None or hour_scaler is None:
#         raise Exception("Model chưa được tải hoặc bị lỗi. Vui lòng kiểm tra file h5 và scaler.")
    
#     # ... (các bước One-Hot Encoding và Scaling không đổi)
#     # Logic One-Hot Encoding và Scaling của bạn là CHÍNH XÁC theo cách bạn đã huấn luyện (7 One-Hot + 1 Scaled).

#     # 1. Xử lý One-Hot Encoding cho 'day'
#     day_vector = np.zeros(7)
#     if 0 <= day <= 6:
#         day_vector[day] = 1
    
#     # 2. Chuẩn hóa 'hour'
#     hour_scaled = hour_scaler.transform(np.array([[hour]]))
    
#     # 3. Tạo Input Feature (7 ngày + 1 giờ = 8 features)
#     # Lấy giá trị đã scale (1 phần tử) ra khỏi mảng 2D và nối
#     input_features = np.concatenate([day_vector, hour_scaled.flatten()]) 
    
#     # 4. Dự đoán
#     prediction = model.predict(input_features.reshape(1, -1), verbose=0)
    
#     raw_result = float(prediction[0][0])
#     # Đảm bảo kết quả luôn là số không âm
#     return max(0, raw_result) 

# if __name__ == '__main__':
#     # ... (Test code không đổi)
#     day_test = 5 
#     hour_test = 20
    
#     if model and hour_scaler:
#         result = predict_reservation(day_test, hour_test)
#         print(f"Dự đoán thô (Thứ {day_test}, Giờ {hour_test}): {result:.2f} khách")
#     else:
#         print("Không thể chạy thử vì Model/Scaler bị lỗi tải.")

# predict.py

# import numpy as np
# import pickle
# from tensorflow.keras.models import load_model
# from sklearn.preprocessing import StandardScaler
# import os

# # --- Định nghĩa đường dẫn ---
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "model/reservation_model.h5")
# SCALER_PATH = os.path.join(BASE_DIR, "model/hour_scaler.pkl")
# FEATURES_PATH = os.path.join(BASE_DIR, "model/feature_columns.pkl")

# # --- Load model ---
# try:
#     model = load_model(MODEL_PATH, compile=False)  # compile=False tránh lỗi 'mse'
#     print(" Model loaded OK")
# except Exception as e:
#     model = None
#     print(" Lỗi load model:", e)

# # --- Load scaler ---
# try:
#     with open(SCALER_PATH, 'rb') as f:
#         hour_scaler = pickle.load(f)
#     print(" Scaler loaded OK")
# except Exception as e:
#     hour_scaler = None
#     print(" Lỗi load scaler:", e)

# # --- Load feature columns ---
# try:
#     with open(FEATURES_PATH, 'rb') as f:
#         feature_cols = pickle.load(f)
#     print(" Feature columns loaded OK")
# except Exception as e:
#     feature_cols = []
#     print(" Lỗi load feature columns:", e)


# def predict_reservation(day: int, hour: int) -> float:
#     if model is None or hour_scaler is None or not feature_cols:
#         raise Exception("Model, scaler hoặc feature columns chưa sẵn sàng.")

#     # Nếu ngày không tồn tại trong feature columns → trả về 0
#     day_col = f"day_{day}"
#     if day_col not in feature_cols:
#         return 0.0

#     # Tạo vector input theo thứ tự feature_cols
#     input_data = []
#     for col in feature_cols:
#         if col.startswith("day_"):
#             d = int(col.split("_")[1])
#             input_data.append(1 if d == day else 0)

#     # Thêm hour đã scale
#     scaled_hour = hour_scaler.transform([[hour]])[0][0]
#     input_data.append(scaled_hour)

#     # Dự đoán
#     pred = model.predict(np.array([input_data]), verbose=0)[0][0]
#     return max(0, float(pred))


# predict.py
import numpy as np
import pickle
from tensorflow.keras.models import load_model
import os

# --- Đường dẫn ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model/reservation_model.h5")
SCALER_PATH = os.path.join(BASE_DIR, "model/hour_scaler.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "model/feature_columns.pkl")

# --- Load model ---
model = load_model(MODEL_PATH, compile=False)
with open(SCALER_PATH, 'rb') as f:
    hour_scaler = pickle.load(f)
with open(FEATURES_PATH, 'rb') as f:
    feature_cols = pickle.load(f)

def predict_reservation(day: int, hour: int) -> float:
    """
    Dự đoán số khách theo ngày và giờ.
    day: 0 = Monday, ..., 6 = Sunday
    hour: 0-23
    """
    # Tạo vector input
    input_data = []
    for col in feature_cols:
        if col.startswith("day_"):
            d = int(col.split("_")[1])
            input_data.append(1 if d == day else 0)

    # Thêm giờ đã scale
    scaled_hour = hour_scaler.transform([[hour]])[0][0]
    input_data.append(scaled_hour)

    # Predict
    pred = model.predict(np.array([input_data]), verbose=0)[0][0]
    return max(0, float(pred))  # đảm bảo không âm

# --- Test nhanh ---
if __name__ == "__main__":
    for day in range(7):
        print(f"Day {day}, Hour 12 => Predicted party_size:", predict_reservation(day, 12))
