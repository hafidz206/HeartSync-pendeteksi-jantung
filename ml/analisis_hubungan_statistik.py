
import pandas as pd
from scipy.stats import spearmanr, chi2_contingency

df = pd.read_csv("ml/dataset/heart_disease.csv")

target = "Heart Disease Status"

df[target] = (
    df[target]
    .astype("string")
    .str.strip()
    .str.lower()
    .map({"no": 0, "yes": 1})
)

numeric_features = df.drop(
    columns=[target]
).select_dtypes(include="number").columns

categorical_features = df.drop(
    columns=[target]
).select_dtypes(exclude="number").columns

print("=== UJI SPEARMAN ===")

for feature in numeric_features:
    data = df[[feature, target]].dropna()

    correlation, p_value = spearmanr(
        data[feature],
        data[target]
    )

    print(f"\nFitur: {feature}")
    print(f"Korelasi: {correlation:.4f}")
    print(f"P-value: {p_value:.4f}")

print("\n=== UJI CHI-SQUARE ===")

for feature in categorical_features:
    data = df[[feature, target]].dropna()

    table = pd.crosstab(
        data[feature],
        data[target]
    )

    chi2, p_value, dof, expected = chi2_contingency(table)

    print(f"\nFitur: {feature}")
    print(f"Chi-Square: {chi2:.4f}")
    print(f"P-value: {p_value:.4f}")

print("\n=== ANALISIS SELESAI ===")
