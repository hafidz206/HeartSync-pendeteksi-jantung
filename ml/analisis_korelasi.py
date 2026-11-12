
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Membaca dataset
df = pd.read_csv("ml/dataset/heart_disease.csv")

# Mengubah target menjadi angka
df["Heart Disease Status"] = (
    df["Heart Disease Status"].map({"No": 0, "Yes": 1})
)

# Mengubah atribut kategori menjadi angka
df_encoded = pd.get_dummies(df, drop_first=True)

# Menghitung korelasi terhadap target
correlation = df_encoded.corr(numeric_only=True)

target_corr = (
    correlation["Heart Disease Status"]
    .drop("Heart Disease Status")
    .sort_values(key=abs, ascending=False)
)

print("\n=== KORELASI ATRIBUT TERHADAP TARGET ===")
print(target_corr)

# Visualisasi 10 atribut dengan korelasi tertinggi
top_features = target_corr.head(10)

plt.figure(figsize=(10, 6))
sns.barplot(x=top_features.values, y=top_features.index)
plt.title("10 Atribut dengan Korelasi Tertinggi terhadap Heart Disease Status")
plt.xlabel("Nilai Korelasi")
plt.ylabel("Atribut")
plt.tight_layout()
plt.show()
