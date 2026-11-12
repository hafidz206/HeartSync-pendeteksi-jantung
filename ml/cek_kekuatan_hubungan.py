
import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency

df = pd.read_csv("ml/dataset/heart_disease.csv")

target = "Heart Disease Status"
feature = "Stress Level"

df[target] = (
    df[target]
    .astype("string")
    .str.strip()
    .str.lower()
    .map({"no": 0, "yes": 1})
)

data = df[[feature, target]].dropna()

# Tabel silang
table = pd.crosstab(
    data[feature],
    data[target]
)

print("=== DISTRIBUSI TARGET BERDASARKAN STRESS LEVEL ===")
print(table)

print("\n=== PERSENTASE TARGET ===")
print(
    pd.crosstab(
        data[feature],
        data[target],
        normalize="index"
    ).mul(100).round(2)
)

# Chi-Square dan Cramer's V
chi2, p_value, dof, expected = chi2_contingency(table)

n = table.to_numpy().sum()
min_dimension = min(table.shape) - 1

cramers_v = np.sqrt(
    chi2 / (n * min_dimension)
)

print("\n=== HASIL PENGUJIAN ===")
print(f"Chi-Square : {chi2:.4f}")
print(f"P-value    : {p_value:.4f}")
print(f"Cramer's V : {cramers_v:.4f}")

print("\n=== PEMERIKSAAN SELESAI ===")
