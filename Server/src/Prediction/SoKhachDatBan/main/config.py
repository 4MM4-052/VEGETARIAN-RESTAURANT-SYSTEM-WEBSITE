import os

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'cv07_huong_sen_restaurant'
}

# Đường dẫn tuyệt đối đến file model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'reservation_model.h5')

EPOCHS = 100
BATCH_SIZE = 32
