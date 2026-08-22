# # train_model.py

# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense
# from data_preprocessing import get_reservation_data
# from config import MODEL_PATH, EPOCHS, BATCH_SIZE

# def train_and_save_model():
#     X, y = get_reservation_data()
    
#     if X.empty:
#         print("Không có dữ liệu để huấn luyện. Dừng training.")
#         return

#     # Số lượng features: 7 cột cho day (One-Hot) + 1 cột cho hour (Scaled) = 8
#     input_dim = X.shape[1] 

#     model = Sequential([
#         Dense(8, activation='relu', input_dim=input_dim), # Tăng số neuron
#         Dense(4, activation='relu'),
#         Dense(1)  # Đầu ra linear cho hồi quy (Regression)
#     ])
    
#     # Sử dụng MSE (Mean Squared Error) cho bài toán Regression
#     model.compile(optimizer='adam', loss='mse') 
    
#     print("\n--- BẮT ĐẦU HUẤN LUYỆN ---")
#     model.fit(X, y, epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1)

#     model.save(MODEL_PATH)
#     print("\nModel đã lưu tại:", MODEL_PATH)

# if __name__ == "__main__":
#     train_and_save_model()

# train_model.py

# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense
# from data_preprocessing import get_reservation_data
# from config import MODEL_PATH, EPOCHS, BATCH_SIZE

# def train_and_save_model():
#     X, y = get_reservation_data()
#     if X.empty:
#         print("Không có dữ liệu.")
#         return

#     input_dim = X.shape[1]

#     model = Sequential([
#         Dense(16, activation='relu', input_dim=input_dim),
#         Dense(8, activation='relu'),
#         Dense(1)
#     ])

#     model.compile(optimizer='adam', loss='mse')
#     model.fit(X, y, epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1)

#     model.save(MODEL_PATH)
#     print("Model saved:", MODEL_PATH)


# if __name__ == "__main__":
#     train_and_save_model()


# train_model.py
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from data_preprocessing import get_reservation_data
from config import MODEL_PATH, EPOCHS, BATCH_SIZE

def train_and_save_model():
    X, y = get_reservation_data()
    if X.empty:
        print("Không có dữ liệu.")
        return

    input_dim = X.shape[1]

    # Build model
    model = Sequential([
        Dense(16, activation='relu', input_dim=input_dim),
        Dense(8, activation='relu'),
        Dense(1)  # Output là số lượng khách
    ])
    model.compile(optimizer='adam', loss='mse')

    # Train model
    model.fit(X, y, epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1)

    # Lưu model
    model.save(MODEL_PATH)
    print("Model saved:", MODEL_PATH)

if __name__ == "__main__":
    train_and_save_model()

