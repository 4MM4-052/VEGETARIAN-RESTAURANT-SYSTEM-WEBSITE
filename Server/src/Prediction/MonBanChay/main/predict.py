import os
import joblib
import pandas as pd

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "model", "mon_ban_chay.pkl"))
LOOKUP_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "model", "mon_ban_chay_lookup.csv"))

model = joblib.load(MODEL_PATH)
lookup_df = pd.read_csv(LOOKUP_PATH)

def predict_top5(day, hour):
    possible = lookup_df[(lookup_df['day_of_week'] == day) & (lookup_df['hour'] == hour)]
    if possible.empty:
        return {"day": day, "hour": hour, "prediction": "Không có dữ liệu"}

    possible['pred_qty'] = possible.apply(lambda row: max(1, round(model.predict([[day, row['hour']]])[0])), axis=1)
    top5 = possible.sort_values(by='pred_qty', ascending=False).head(5)

    prediction = [{"product_name": row['product_name'], "predicted_quantity": int(row['pred_qty'])} for _, row in top5.iterrows()]
    return {"day": day, "hour": hour, "top5": prediction}

def predict_top5_by_day(day):
    hourly_top5 = {}
    hours = sorted(lookup_df[lookup_df['day_of_week'] == day]['hour'].unique())
    for hour in hours:
        top5 = predict_top5(day, hour)['top5']
        hourly_top5[str(hour)] = top5
    return {"day": day, "hourly_top5": hourly_top5}


# import pandas as pd
# import joblib
# from datetime import datetime

# # Load models
# quantity_model = joblib.load('model/quantity_model.pkl')
# probability_model = joblib.load('model/probability_model.pkl')

# def predict_product(product_name, date_str):
#     date = pd.to_datetime(date_str)
#     day_of_week = date.weekday()

#     # Tạo DataFrame input mẫu
#     df_qty = pd.DataFrame({
#         'product_name': [product_name],
#         'day_of_week': [day_of_week],
#         'time_slot': ['6-11']  # ví dụ khung giờ mặc định
#     })
#     df_prob = pd.DataFrame({
#         'product_name': [product_name],
#         'day_of_week': [day_of_week]
#     })

#     # Load preprocess (dummies)
#     df_qty = pd.get_dummies(df_qty)
#     df_prob = pd.get_dummies(df_prob)

#     # Align với train columns nếu thiếu
#     df_qty = df_qty.reindex(columns=quantity_model.feature_names_in_, fill_value=0)
#     df_prob = df_prob.reindex(columns=probability_model.feature_names_in_, fill_value=0)

#     qty_pred = quantity_model.predict(df_qty)[0]
#     prob_pred = probability_model.predict_proba(df_prob)[0][1]

#     print(f"Product: {product_name}")
#     print(f"Predicted quantity: {qty_pred:.0f}")
#     print(f"Predicted probability of being sold: {prob_pred:.2f}")

# if __name__ == "__main__":
#     product_name = input("Enter product name: ")
#     date_str = input("Enter date (YYYY-MM-DD): ")
#     predict_product(product_name, date_str)




# import pandas as pd
# import joblib
# import os

# # Load model
# quantity_model = joblib.load('model/quantity_model.pkl')
# probability_model = joblib.load('model/probability_model.pkl')

# # Dữ liệu tham chiếu (để cold-start)
# products_df = pd.read_csv('data/probability_data.csv')
# products_df['product_name'] = products_df['product_name'].str.lower().str.strip()
# all_products = products_df['product_name'].unique()

# # Giá trị trung bình cho cold-start
# avg_prob = products_df['sold'].mean() if 'sold' in products_df.columns else 0.1
# avg_qty = products_df['sold'].mean() if 'sold' in products_df.columns else 1

# # Ngày & khung giờ
# DAYS = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật']
# TIME_SLOTS = ['6-11','11-14','17-22']

# def predict_week(product_name_input):
#     product_name = product_name_input.strip().lower()
    
#     results = []
#     for day_idx, day_name in enumerate(DAYS):
#         # --- Xác suất bán ---
#         if product_name in all_products:
#             df_prob = pd.DataFrame({'product_name':[product_name],'day_of_week':[day_idx]})
#             df_prob = pd.get_dummies(df_prob)
#             df_prob = df_prob.reindex(columns=probability_model.feature_names_in_, fill_value=0)
#             prob_pred = probability_model.predict_proba(df_prob)[0][1]
#         else:
#             prob_pred = avg_prob
#             if day_idx == 0:
#                 print(f"⚠️ Món '{product_name_input}' chưa có dữ liệu lịch sử. Sử dụng giá trị trung bình.")

#         # --- Số lượng & giờ cao điểm ---
#         max_qty = 0
#         best_slot = ''
#         for slot in TIME_SLOTS:
#             if product_name in all_products:
#                 df_qty = pd.DataFrame({'product_name':[product_name],'day_of_week':[day_idx],'time_slot':[slot]})
#                 df_qty = pd.get_dummies(df_qty)
#                 df_qty = df_qty.reindex(columns=quantity_model.feature_names_in_, fill_value=0)
#                 qty_pred = quantity_model.predict(df_qty)[0]
#             else:
#                 qty_pred = avg_qty

#             if qty_pred > max_qty:
#                 max_qty = qty_pred
#                 best_slot = slot

#         results.append({
#             'Ngày': day_name,
#             'Xác suất bán': f"{round(prob_pred*100,2)}%",
#             'Giờ cao điểm': best_slot,
#             'SL dự đoán': round(max_qty)
#         })
    
#     # In bảng kết quả
#     df_results = pd.DataFrame(results)
#     print(f"\n===== Dự đoán cho món: {product_name_input} =====")
#     print(df_results)

#     # Lưu CSV
#     os.makedirs('results', exist_ok=True)
#     filename = f"results/prediction_{product_name_input.replace(' ','_')}.csv"
#     df_results.to_csv(filename, index=False)
#     print(f"\n✅ File CSV lưu tại: {filename}")


# if __name__ == "__main__":
#     product_name_input = input("Nhập tên món ăn: ")
#     predict_week(product_name_input)
