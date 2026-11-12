
import pandas as pd
from scipy.stats import chi2_contingency, mannwhitneyu

df = pd.read_csv("ml/dataset/heart_disease.csv")

target = "Heart Disease Status"

print("=== UJI ATRIBUT NUMERIK ===")

numeric_columns = df.select_dtypes(include="number").columns

for col in numeric_columns:
    no = df.loc[df[target] == "No", col].dropna()
    yes = df.loc[df[target] == "Yes", col].dropna()

    statistic, p_value = mannwhitneyu(
        no, yes, alternative="two-sided"
    )

    print(
        f"{col:25} p-value: {p_value:.6f}"
    )

print("\n=== UJI ATRIBUT KATEGORIK ===")

categorical_columns = df.select_dtypes(
    exclude="number"
).columns.drop(target)

for col in categorical_columns:
    table = pd.crosstab(df[col], df[target])

    chi2, p_value, dof, expected = chi2_contingency(table)

    print(
        f"{col:25} p-value: {p_value:.6f}"
    )
