
import pandas as pd

df = pd.read_csv("ml/dataset/heart_disease.csv")

print("JUMLAH BARIS DAN KOLOM:")
print(df.shape)

print("\nNAMA ATRIBUT:")
print(df.columns.tolist())

print("\nTIPE DATA:")
print(df.dtypes)

print("\n5 DATA PERTAMA:")
print(df.head())

print("\nDATA KOSONG:")
print(df.isnull().sum())

print("\nDATA DUPLIKAT:")
print(df.duplicated().sum())

# 1. Persentase data kosong
print("\n=== PERSENTASE DATA KOSONG ===")
print((df.isnull().mean() * 100).round(2))

# 2. Distribusi target
print("\n=== DISTRIBUSI TARGET ===")
print(df["Heart Disease Status"].value_counts(dropna=False))

print("\n=== PERSENTASE TARGET ===")
print(
    (df["Heart Disease Status"].value_counts(normalize=True) * 100).round(2)
)

# 3. Nilai unik atribut kategorikal
kolom_kategori = df.select_dtypes(include=["str", "object", "category"]).columns

print("\n=== NILAI UNIK ATRIBUT KATEGORIKAL ===")
for kolom in kolom_kategori:
    print(f"\n{kolom}:")
    print(df[kolom].value_counts(dropna=False))

# 4. Statistik atribut numerik
print("\n=== STATISTIK DATA NUMERIK ===")
print(df.describe().round(2))

# Memeriksa rentang seluruh atribut numerik
print("\n=== RENTANG ATRIBUT NUMERIK ===")
kolom_numerik = df.select_dtypes(include="number").columns

for kolom in kolom_numerik:
    print(
        f"{kolom}: "
        f"Min={df[kolom].min()}, "
        f"Max={df[kolom].max()}"
    )

# Memeriksa spasi tambahan pada atribut kategorikal
print("\n=== PEMERIKSAAN SPASI KATEGORIKAL ===")
kolom_kategori = df.select_dtypes(
    include=["str", "object", "category"]
).columns

for kolom in kolom_kategori:
    nilai = df[kolom].dropna().astype(str)
    bermasalah = nilai[nilai != nilai.str.strip()]

    if len(bermasalah) > 0:
        print(f"{kolom}: {len(bermasalah)} nilai memiliki spasi tambahan")
    else:
        print(f"{kolom}: Tidak ditemukan spasi tambahan")

# Memeriksa label target
print("\n=== VALIDASI TARGET ===")
print(df["Heart Disease Status"].unique())
