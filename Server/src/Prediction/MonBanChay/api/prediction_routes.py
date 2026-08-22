# from flask import Blueprint, request, jsonify
# from ..main.predict import predict

# mon_ban_chay_bp = Blueprint("mon_ban_chay_bp", __name__)

# @mon_ban_chay_bp.route("/", methods=["GET"])
# def predict_route():
#     try:
#         day = int(request.args.get("day"))
#         hour = int(request.args.get("hour"))
#     except (TypeError, ValueError):
#         return jsonify({"error": "day và hour phải là số nguyên"}), 400

#     quantity = predict(day, hour)
#     return jsonify({
#         "predicted_quantity": quantity,
#         "day": day,
#         "hour": hour
#     })
    
from flask import Blueprint, request, jsonify
from ..main.predict import predict_top5_by_day, predict_top5  # import từ predict.py

mon_ban_chay_bp = Blueprint("mon_ban_chay_bp", __name__)

# Dự đoán theo giờ cụ thể (giữ nguyên)
@mon_ban_chay_bp.route("/", methods=["GET"])
def mon_ban_chay():
    try:
        day = int(request.args.get("day", 1))
        hour = int(request.args.get("hour", 7))
        result = predict_top5(day, hour)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Dự đoán theo cả ngày (tất cả các giờ)
@mon_ban_chay_bp.route("/by_day", methods=["GET"])
def mon_ban_chay_by_day():
    try:
        day = int(request.args.get("day", 1))
        result = predict_top5_by_day(day)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

