
import pandas as pd

file_path = "ml/dataset/heart_disease.csv"

df = pd.read_csv(file_path)

print("=== INFORMASI DATASET ===")
print("Jumlah baris:", len(df))
print("Jumlah kolom:", len(df.columns))

print("\n=== TIPE DATA ===")
print(df.dtypes)

print("\n=== MISSING VALUE ===")
print(df.isnull().sum())

print("\n=== DUPLIKASI ===")
print("Jumlah baris duplikat:", df.duplicated().sum())

print("\n=== DISTRIBUSI TARGET ===")
print(df["Heart Disease Status"].value_counts())

print("\n=== CONTOH DATA ===")
print(df.head(10).to_string(index=False))

print("\n=== STATISTIK DESKRIPTIF ===")
print(df.describe(include="all").to_string())

print("\n=== PEMERIKSAAN SELESAI ===")
