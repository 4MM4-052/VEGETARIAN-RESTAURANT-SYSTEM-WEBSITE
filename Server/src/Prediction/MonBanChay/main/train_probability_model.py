import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
from preprocess import preprocess_probability

df = pd.read_csv('data/probability_data.csv')
df_processed = preprocess_probability(df)

X = df_processed.drop('sold', axis=1)
y = df_processed['sold']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

joblib.dump(model,'model/probability_model.pkl')
print("Probability model trained and saved!")
