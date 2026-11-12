
import pandas as pd

# Membaca dataset
df = pd.read_csv("ml/dataset/heart_disease.csv")

target = "Heart Disease Status"

numeric_features = [
    "Age",
    "BMI",
    "Blood Pressure",
    "Cholesterol Level"
]

categorical_features = [
    "Gender",
    "Diabetes",
    "Family Heart Disease",
    "Smoking",
    "Exercise Habits"
]

# Mengubah target
df[target] = (
    df[target]
    .astype("string")
    .str.strip()
    .str.lower()
    .map({"no": 0, "yes": 1})
)

print("=== DISTRIBUSI TARGET ===")
print(df[target].value_counts())
print("\nPersentase target:")
print(df[target].value_counts(normalize=True) * 100)

# Pemeriksaan fitur numerik
print("\n=== HUBUNGAN FITUR NUMERIK ===")

for feature in numeric_features:
    print(f"\nAtribut: {feature}")

    df["kelompok"] = pd.qcut(
        df[feature],
        q=4,
        duplicates="drop"
    )

    result = df.groupby(
        "kelompok",
        observed=True
    )[target].agg(
        jumlah="count",
        persentase_yes="mean"
    )

    result["persentase_yes"] *= 100

    print(result)

# Pemeriksaan fitur kategorikal
print("\n=== HUBUNGAN FITUR KATEGORIKAL ===")

for feature in categorical_features:
    print(f"\nAtribut: {feature}")

    result = pd.crosstab(
        df[feature],
        df[target],
        normalize="index"
    ) * 100

    print(result.round(2))

print("\n=== PEMERIKSAAN SELESAI ===")
