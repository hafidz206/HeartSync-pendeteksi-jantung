
import pandas as pd

df = pd.read_csv("ml/dataset/heart_disease.csv")

target = "Heart Disease Status"

# Mengubah target menjadi angka
df[target] = (
    df[target]
    .astype("string")
    .str.strip()
    .str.lower()
    .map({"no": 0, "yes": 1})
)

# Mengidentifikasi fitur numerik dan kategorikal
numeric_features = df.drop(columns=[target]).select_dtypes(
    include="number"
).columns

categorical_features = df.drop(columns=[target]).select_dtypes(
    exclude="number"
).columns

print("=== HUBUNGAN SELURUH FITUR NUMERIK ===")

for feature in numeric_features:
    result = df.groupby(
        pd.qcut(df[feature], q=4, duplicates="drop"),
        observed=True
    )[target].mean() * 100

    print(f"\n{feature}")
    print(result.round(2))

print("\n=== HUBUNGAN SELURUH FITUR KATEGORIKAL ===")

for feature in categorical_features:
    result = pd.crosstab(
        df[feature],
        df[target],
        normalize="index"
    ) * 100

    print(f"\n{feature}")
    print(result.round(2))

print("\n=== PEMERIKSAAN SELESAI ===")
