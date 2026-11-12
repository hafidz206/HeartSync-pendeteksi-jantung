
import pandas as pd

df = pd.read_csv("ml/dataset/heart_disease.csv")

fitur = [
    "Age",
    "BMI",
    "Blood Pressure",
    "Cholesterol Level"
]

print("=== DISTRIBUSI FITUR NUMERIK ===")

for col in fitur:
    print(f"\nAtribut: {col}")

    print("Minimum :", df[col].min())
    print("Q1      :", df[col].quantile(0.25))
    print("Median  :", df[col].median())
    print("Q3      :", df[col].quantile(0.75))
    print("Maximum :", df[col].max())

    print("\nJumlah data per kuartil:")
    print(
        pd.qcut(
            df[col],
            q=4,
            duplicates="drop"
        ).value_counts().sort_index()
    )
