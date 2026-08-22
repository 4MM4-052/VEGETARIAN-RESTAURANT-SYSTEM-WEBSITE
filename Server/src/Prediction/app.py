# # app.py

# from flask import Flask, jsonify
# from flask_cors import CORS
# from reservation_prediction.api.prediction_routes import prediction_bp

# def create_app(config_object=None):
#     """Factory function để tạo và cấu hình ứng dụng Flask."""
    
#     app = Flask(__name__)
#     CORS(app, resources={r"/api/*": {"origins": "*"}}) 

#     # Đăng ký Blueprint (API Routes)
#     app.register_blueprint(prediction_bp, url_prefix='/api') 

#     # Route mặc định (Home)
#     @app.route('/')
#     def home():
#         return "Server Reservation Prediction đang chạy. Sử dụng /api/predict/<day>/<hour> để dự đoán số khách."

#     # Global Error Handler
#     @app.errorhandler(404)
#     def not_found(error):
#         return jsonify({'error': 'Not found'}), 404

#     return app

# if __name__ == '__main__':
#     # Chạy bằng cách gọi hàm create_app
#     app = create_app()
#     app.run(debug=True, host='0.0.0.0', port=5000)


# app.py

from flask import Flask
from flask_cors import CORS

from Prediction.SoKhachDatBan.api.prediction_routes import prediction_bp
from Prediction.MonBanChay.api.prediction_routes import mon_ban_chay_bp  

app = Flask(__name__)
CORS(app)

# URL frontend muốn là: /api/predict/so_khach_dat_ban/<day>/<hour>
app.register_blueprint(prediction_bp, url_prefix="/api/predict/so_khach_dat_ban")
app.register_blueprint(mon_ban_chay_bp, url_prefix="/api/predict/mon_ban_chay") 

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

# from src.Prediction.MonBanChay.main.export_data import export_quantity_csv, export_probability_csv
# from src.Prediction.MonBanChay.main.train_quantity_model import *
# from src.Prediction.MonBanChay.main.train_probability_model import *
# from src.Prediction.MonBanChay.main.predict import predict_product

# if __name__ == "__main__":
#     # 1. Xuất dữ liệu từ DB ra CSV
#     export_quantity_csv()
#     export_probability_csv()

#     # 2. Train 2 mô hình
#     # Chạy các script train_quantity_model.py và train_probability_model.py
#     # hoặc import hàm train từ đó nếu viết modular

#     # 3. Dự đoán
#     product_name = input("Enter product name: ")
#     date_str = input("Enter date (YYYY-MM-DD): ")
#     predict_product(product_name, date_str)


