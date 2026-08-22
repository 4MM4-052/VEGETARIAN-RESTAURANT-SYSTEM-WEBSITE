# # api/prediction_routes.py

# from flask import Blueprint, jsonify
# import sys
# from ..main.predict import predict_reservation

# # Khởi tạo Blueprint
# prediction_bp = Blueprint('prediction', __name__)

# @prediction_bp.route('/predict/<int:day>/<int:hour>', methods=['GET'])
# def predict(day, hour):
#     # ... (logic không đổi)
#     try:
#         # 1. Gọi hàm dự đoán AI
#         result = predict_reservation(day, hour)
        
#         # 2. Làm tròn kết quả
#         predicted_guests = int(round(result)) # Sử dụng round() thay vì int() để làm tròn gần nhất
        
#         return jsonify({
#             'day': day,
#             'hour': hour,
#             'predicted_guests': predicted_guests
#         })
#     except Exception as e:
#         # Log lỗi ra console của Flask
#         # ...
#         return jsonify({
#             'error': 'Internal Server Error. Could not process prediction.',
#             'details': str(e)
#         }), 500


# prediction_routes.py

from flask import Blueprint, jsonify
from ..main.predict import predict_reservation

prediction_bp = Blueprint("prediction_bp", __name__)

@prediction_bp.route("/<int:day>/<int:hour>", methods=["GET"])
def predict(day, hour):
    try:
        result = predict_reservation(day, hour)
        return jsonify({
            "day": day,
            "hour": hour,
            "predicted_guests": result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


