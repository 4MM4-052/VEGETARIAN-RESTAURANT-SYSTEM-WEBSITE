import pandas as pd

def preprocess_quantity(df):
    df = df.copy()
    df = pd.get_dummies(df, columns=['product_name','time_slot'], drop_first=True)
    return df

def preprocess_probability(df):
    df = df.copy()
    df = pd.get_dummies(df, columns=['product_name'], drop_first=True)
    return df
