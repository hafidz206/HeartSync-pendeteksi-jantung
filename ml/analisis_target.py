
import pandas as pd

df = pd.read_csv("ml/dataset/heart_disease.csv")

print("=== RATA-RATA ATRIBUT NUMERIK BERDASARKAN TARGET ===")

numeric_columns = df.select_dtypes(include="number").columns

hasil = df.groupby("Heart Disease Status")[numeric_columns].mean().T

print(hasil.round(3))

print("\n=== PROPORSI ATRIBUT KATEGORIK BERDASARKAN TARGET ===")

categorical_columns = df.select_dtypes(exclude="number").columns.drop(
    "Heart Disease Status"
)

for col in categorical_columns:
    print(f"\nAtribut: {col}")

    proporsi = pd.crosstab(
        df[col],
        df["Heart Disease Status"],
        normalize="columns"
    ) * 100

    print(proporsi.round(2))
