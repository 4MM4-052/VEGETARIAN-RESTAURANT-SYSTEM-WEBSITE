import os
import pandas as pd
from db_connection import get_connection

# Thư mục lưu file CSV
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# Export dữ liệu số lượng
def export_quantity_csv():
    conn = get_connection()
    query = """
        SELECT p.name AS product_name, r.reservation_date, rd.quantity
        FROM reservations r
        JOIN reservation_details rd ON r.id = rd.reservation_id
        JOIN products p ON rd.product_id = p.id
        WHERE r.status = 1
    """
    df = pd.read_sql(query, conn)
    conn.close()

    if df.empty:
        print("No data returned for quantity.")
        return

    df['reservation_date'] = pd.to_datetime(df['reservation_date'])
    df['day_of_week'] = df['reservation_date'].dt.weekday
    df['hour'] = df['reservation_date'].dt.hour

    # Tạo time_slot
    def time_slot(hour):
        if 6 <= hour < 11:
            return '6-11'
        elif 11 <= hour < 14:
            return '11-14'
        elif 17 <= hour < 22:
            return '17-22'
        else:
            return 'other'

    df['time_slot'] = df['hour'].apply(time_slot)

    quantity_file = os.path.join(DATA_DIR, 'quantity_data.csv')
    df[['product_name','reservation_date','day_of_week','time_slot','quantity']].to_csv(quantity_file, index=False)
    print(f"quantity_data.csv created at: {quantity_file}")

# Export dữ liệu xác suất bán
def export_probability_csv():
    conn = get_connection()
    query = """
        SELECT p.name AS product_name, DATE(r.reservation_date) AS date_only
        FROM reservations r
        JOIN reservation_details rd ON r.id = rd.reservation_id
        JOIN products p ON rd.product_id = p.id
        WHERE r.status = 1
    """
    df = pd.read_sql(query, conn)
    conn.close()

    if df.empty:
        print("No data returned for probability.")
        return

    df['date_only'] = pd.to_datetime(df['date_only'])
    df['day_of_week'] = df['date_only'].dt.weekday

    # Lấy tất cả sản phẩm
    conn = get_connection()
    products = pd.read_sql("SELECT name FROM products", conn)
    conn.close()

    all_days = range(7)  # 0-6, đại diện cho các ngày trong tuần
    all_combinations = pd.MultiIndex.from_product([all_days, products['name']], names=['day_of_week','product_name'])
    df_all = pd.DataFrame(index=all_combinations).reset_index()

    sold_df = df.groupby(['day_of_week','product_name']).size().reset_index(name='sold')
    df_merged = pd.merge(df_all, sold_df, on=['day_of_week','product_name'], how='left')
    df_merged['sold'] = df_merged['sold'].apply(lambda x: 1 if x >= 1 else 0)

    probability_file = os.path.join(DATA_DIR, 'probability_data.csv')
    df_merged[['product_name','day_of_week','sold']].to_csv(probability_file, index=False)
    print(f"probability_data.csv created at: {probability_file}")

# Chạy xuất cả 2 file
if __name__ == "__main__":
    export_quantity_csv()
    export_probability_csv()
