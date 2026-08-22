# # data_preprocessing.py

# from config import DB_CONFIG
# import pickle
# import pandas as pd
# import numpy as np
# import mysql.connector
# from sklearn.preprocessing import StandardScaler # Thêm scaler

# def get_reservation_data():
#     # Kết nối MySQL
#     try:
#         conn = mysql.connector.connect(**DB_CONFIG)
#         query = "SELECT reservation_date, party_size, status FROM reservations"
#         df = pd.read_sql(query, conn)
#     except Exception as e:
#         print(f"LỖI KẾT NỐI DB HOẶC TRUY VẤN: {e}")
#         return pd.DataFrame(), pd.Series()
#     finally:
#         if 'conn' in locals() and conn.is_connected():
#             conn.close()

#     # Lọc các đặt bàn xác nhận
#     # Chỉ giữ lại các bản ghi có status >= 3 và party_size > 0
#     df = df[(df['status'] >= 3) & (df['party_size'] > 0)]
    
#     # Kiểm tra số lượng bản ghi sau lọc
#     if df.empty:
#         print("CẢNH BÁO: Dữ liệu sau lọc rỗng hoặc party_size = 0. Model sẽ dự đoán 0.")
#         return pd.DataFrame(), pd.Series()
    
#     # Chuyển sang datetime và tạo features
#     df['reservation_date'] = pd.to_datetime(df['reservation_date'])
#     df['day'] = df['reservation_date'].dt.dayofweek    # 0=Monday
#     df['hour'] = df['reservation_date'].dt.hour
    
#     # 1. One-Hot Encoding cho 'day'
#     day_encoded = pd.get_dummies(df['day'], prefix='day')
    
#     # 2. Chuẩn hóa 'hour' (Quan trọng để NN hoạt động tốt)
#     # Fit scaler trên dữ liệu giờ hiện có
#     hour_scaler = StandardScaler()
#     hour_scaled = hour_scaler.fit_transform(df[['hour']])
#     hour_scaled_df = pd.DataFrame(hour_scaled, columns=['hour_scaled'], index=df.index)

#     # 3. Kết hợp Features
#     X = pd.concat([day_encoded, hour_scaled_df], axis=1)
#     y = df['party_size']
    
#     # Lưu scaler (Cần thiết cho predict.py)
   
#     with open('hour_scaler.pkl', 'wb') as f:
#         pickle.dump(hour_scaler, f)
        
#     print(f"Số lượng mẫu huấn luyện: {len(X)}")
#     return X, y

# if __name__ == "__main__":
#     X, y = get_reservation_data()
#     if not X.empty:
#         print("\n--- 5 Dòng đầu tiên của X (Features) ---")
#         print(X.head())
#         print("\n--- Thống kê y (Party Size) ---")
#         print(y.describe())

# data_preprocessing.py

# from config import DB_CONFIG
# import pickle
# import pandas as pd
# import mysql.connector
# from sklearn.preprocessing import StandardScaler

# def get_reservation_data():
#     # Lấy dữ liệu từ DB
#     try:
#         conn = mysql.connector.connect(**DB_CONFIG)
#         query = "SELECT reservation_date, party_size, status FROM reservations"
#         df = pd.read_sql(query, conn)
#     except Exception as e:
#         print(f"LỖI DB: {e}")
#         return pd.DataFrame(), pd.Series()
#     finally:
#         if 'conn' in locals() and conn.is_connected():
#             conn.close()

#     # Lọc các đơn hợp lệ
#     df = df[(df['status'] >= 3) & (df['party_size'] > 0)]
#     if df.empty:
#         return pd.DataFrame(), pd.Series()

#     df['reservation_date'] = pd.to_datetime(df['reservation_date'])
#     df['day'] = df['reservation_date'].dt.dayofweek
#     df['hour'] = df['reservation_date'].dt.hour

#     # One-hot theo dữ liệu thật (KHÔNG ép đủ 7 ngày)
#     day_encoded = pd.get_dummies(df['day'], prefix='day')

#     # Chuẩn hóa giờ
#     scaler = StandardScaler()
#     df['hour_scaled'] = scaler.fit_transform(df[['hour']])

#     # Kết hợp features
#     X = pd.concat([day_encoded, df[['hour_scaled']]], axis=1)
#     y = df['party_size']

#     # Lưu scaler
#     with open('model/hour_scaler.pkl', 'wb') as f:
#         pickle.dump(scaler, f)

#     # Lưu danh sách feature để predict
#     with open('model/feature_columns.pkl', 'wb') as f:
#         pickle.dump(X.columns.tolist(), f)

#     print("Số mẫu training:", len(X))
#     print("Feature columns:", X.columns.tolist())

#     return X, y


# if __name__ == "__main__":
#     X, y = get_reservation_data()
#     print(X.head())
#     print(y.describe())

# data_preprocessing.py
import pandas as pd
import pickle
import mysql.connector
from sklearn.preprocessing import StandardScaler
from config import DB_CONFIG

def get_reservation_data():
    """Lấy dữ liệu từ DB, tạo feature và target, chuẩn hóa giờ."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        query = "SELECT reservation_date, party_size, status FROM reservations"
        df = pd.read_sql(query, conn)
    except Exception as e:
        print(f"LỖI DB: {e}")
        return pd.DataFrame(), pd.Series()
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

    # Lọc dữ liệu hợp lệ
    df = df[(df['status'] >= 3) & (df['party_size'] > 0)]
    if df.empty:
        return pd.DataFrame(), pd.Series()

    # Chuyển reservation_date thành datetime
    df['reservation_date'] = pd.to_datetime(df['reservation_date'])
    df['day'] = df['reservation_date'].dt.dayofweek  # 0 = Monday
    df['hour'] = df['reservation_date'].dt.hour

    # One-hot encode 7 ngày cố định
    day_encoded = pd.get_dummies(df['day'], prefix='day')
    for i in range(7):
        col = f"day_{i}"
        if col not in day_encoded.columns:
            day_encoded[col] = 0
    day_encoded = day_encoded[[f"day_{i}" for i in range(7)]]  # sắp xếp cột

    # Chuẩn hóa giờ
    scaler = StandardScaler()
    df['hour_scaled'] = scaler.fit_transform(df[['hour']])

    # Kết hợp features
    X = pd.concat([day_encoded, df[['hour_scaled']]], axis=1)
    y = df['party_size']

    # Lưu scaler
    with open('model/hour_scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)

    # Lưu danh sách feature
    with open('model/feature_columns.pkl', 'wb') as f:
        pickle.dump(X.columns.tolist(), f)

    print("Số mẫu training:", len(X))
    print("Feature columns:", X.columns.tolist())

    return X, y

if __name__ == "__main__":
    X, y = get_reservation_data()
    print(X.head())
    print(y.describe())
