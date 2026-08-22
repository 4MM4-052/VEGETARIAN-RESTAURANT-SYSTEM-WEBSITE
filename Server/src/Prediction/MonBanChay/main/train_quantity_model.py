import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
from preprocess import preprocess_quantity

df = pd.read_csv('data/quantity_data.csv')
df_processed = preprocess_quantity(df)

X = df_processed.drop(['quantity','reservation_date'], axis=1)
y = df_processed['quantity']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

joblib.dump(model,'model/quantity_model.pkl')
print("Quantity model trained and saved!")
