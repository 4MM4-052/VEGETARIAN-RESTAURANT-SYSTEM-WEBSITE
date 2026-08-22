import os
import pandas as pd
import joblib
import mysql.connector
from sklearn.ensemble import RandomForestRegressor

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "mon_ban_chay.pkl")
LOOKUP_PATH = os.path.join(MODEL_DIR, "mon_ban_chay_lookup.csv")

def train_model():
    conn = mysql.connector.connect(
        host="localhost", user="root", password="", database="cv07_huong_sen_restaurant"
    )
    query = """
    SELECT 
        rd.product_id,
        p.name AS product_name,
        DAYOFWEEK(r.reservation_date) AS day_of_week,
        HOUR(r.reservation_date) AS hour,
        SUM(rd.quantity) AS total_quantity
    FROM reservations r
    JOIN reservation_details rd ON r.id = rd.reservation_id
    JOIN products p ON rd.product_id = p.id
    WHERE r.status IN (3,4,5)
    GROUP BY rd.product_id, product_name, day_of_week, hour
    """
    data = pd.read_sql(query, conn)
    conn.close()
    if data.empty:
        print("Chưa có dữ liệu để train model")
        return None

    lookup_df = data[['product_id', 'product_name', 'day_of_week', 'hour']]
    lookup_df.to_csv(LOOKUP_PATH, index=False)

    X = data[['day_of_week', 'hour']]
    y = data['total_quantity']

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print("Model MonBanChay đã train xong và lưu tại", MODEL_PATH)
    print("Lookup file lưu tại", LOOKUP_PATH)
    return model

if __name__ == "__main__":
    train_model()


# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
# import joblib
# from preprocess import preprocess_quantity, preprocess_probability

# # === 1. Model xác suất bán ===
# df_prob = pd.read_csv('data/probability_data.csv')
# df_prob_processed = preprocess_probability(df_prob)
# X_prob = df_prob_processed.drop('sold', axis=1)
# y_prob = df_prob_processed['sold']

# X_train, X_test, y_train, y_test = train_test_split(X_prob, y_prob, test_size=0.2, random_state=42)
# prob_model = RandomForestClassifier(n_estimators=100, random_state=42)
# prob_model.fit(X_train, y_train)
# joblib.dump(prob_model, 'model/probability_model.pkl')
# print("Probability model trained!")

# # === 2. Model số lượng ===
# df_qty = pd.read_csv('data/quantity_data.csv')
# df_qty_processed = preprocess_quantity(df_qty)
# X_qty = df_qty_processed.drop(['quantity','reservation_date'], axis=1)
# y_qty = df_qty_processed['quantity']

# X_train, X_test, y_train, y_test = train_test_split(X_qty, y_qty, test_size=0.2, random_state=42)
# qty_model = RandomForestRegressor(n_estimators=100, random_state=42)
# qty_model.fit(X_train, y_train)
# joblib.dump(qty_model, 'model/quantity_model.pkl')
# print("Quantity model trained!")
