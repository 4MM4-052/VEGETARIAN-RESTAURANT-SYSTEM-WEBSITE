# db.py

MODEL_CONFIG = {
    "LEVEL1_model": "SVM",        # svm | logistic | rf
    "LEVEL2a_model": "RF",          # 1⭐ vs 2⭐
    "LEVEL2b_model": "Logistic"          # 4⭐ vs 5⭐
}

def get_model_config():
    return MODEL_CONFIG

def update_model_config(data):
    MODEL_CONFIG.update(data)
