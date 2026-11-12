
import os
import joblib
import pandas as pd

from sklearn.model_selection import (
    train_test_split,
    GridSearchCV,
    StratifiedKFold
)
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.svm import SVC
from sklearn.dummy import DummyClassifier
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix
)

# =====================================================
# 1. MEMBACA DATASET
# =====================================================

DATASET_PATH = "ml/dataset/heart_disease.csv"
MODEL_PATH = "ml/models/svm_heart_model.joblib"

df = pd.read_csv(DATASET_PATH)

# =====================================================
# 2. MENENTUKAN 9 FITUR MODEL
# =====================================================

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

feature_columns = numeric_features + categorical_features

target = "Heart Disease Status"

# Memastikan seluruh kolom tersedia
required_columns = feature_columns + [target]

missing_columns = [
    col for col in required_columns
    if col not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Kolom dataset tidak ditemukan: {missing_columns}"
    )

# Mengambil hanya 9 fitur dan target
X = df[feature_columns].copy()

# Mengubah target menjadi numerik
df[target] = (
    df[target]
    .astype("string")
    .str.strip()
    .str.lower()
    .map({
        "no": 0,
        "yes": 1
    })
)

if df[target].isnull().any():
    raise ValueError("Label target tidak valid.")

y = df[target].astype(int)

print("=== STRUKTUR DATA MODEL ===")
print("Jumlah seluruh data:", len(df))
print("Jumlah fitur:", len(feature_columns))
print("Fitur numerik:", numeric_features)
print("Fitur kategorikal:", categorical_features)

# =====================================================
# 3. PREPROCESSING NUMERIK
# =====================================================

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

# =====================================================
# 4. PREPROCESSING KATEGORIKAL
# =====================================================

categorical_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(
            strategy="constant",
            fill_value="Unknown"
        )
    ),
    (
        "encoder",
        OneHotEncoder(handle_unknown="ignore")
    )
])

# =====================================================
# 5. MENGGABUNGKAN PREPROCESSING
# =====================================================

preprocessor = ColumnTransformer([
    (
        "numeric",
        numeric_pipeline,
        numeric_features
    ),
    (
        "categorical",
        categorical_pipeline,
        categorical_features
    )
])

# =====================================================
# 6. MEMBAGI DATA TRAINING DAN TESTING
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\n=== PEMBAGIAN DATA ===")
print("Training:", len(X_train))
print("Testing:", len(X_test))

# =====================================================
# 7. BASELINE MODEL
# =====================================================

baseline = DummyClassifier(
    strategy="most_frequent"
)

baseline.fit(X_train, y_train)

baseline_pred = baseline.predict(X_test)

print("\n=== BASELINE ===")
print(
    "Accuracy:",
    accuracy_score(y_test, baseline_pred)
)
print(
    "Balanced Accuracy:",
    balanced_accuracy_score(y_test, baseline_pred)
)

# =====================================================
# 8. MEMBUAT PIPELINE SVM
# =====================================================

pipeline = Pipeline([
    ("preprocessing", preprocessor),
    ("classifier", SVC())
])

# =====================================================
# 9. HYPERPARAMETER TUNING
# =====================================================

parameter_grid = {
    "classifier__kernel": ["rbf"],
    "classifier__C": [0.1, 1, 10, 100],
    "classifier__gamma": ["scale", 0.01, 0.1],
    "classifier__class_weight": [None, "balanced"]
}

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

grid_search = GridSearchCV(
    estimator=pipeline,
    param_grid=parameter_grid,
    scoring="balanced_accuracy",
    cv=cv,
    n_jobs=-1,
    verbose=1
)

# =====================================================
# 10. TRAINING MODEL
# =====================================================

print("\n=== PROSES HYPERPARAMETER TUNING ===")

grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_

print("\nParameter terbaik:")
print(grid_search.best_params_)

print(
    "\nBalanced Accuracy Cross-Validation:",
    grid_search.best_score_
)

# =====================================================
# 11. EVALUASI MODEL
# =====================================================

y_pred = best_model.predict(X_test)

print("\n=== HASIL EVALUASI SVM ===")

print(
    "Accuracy:",
    accuracy_score(y_test, y_pred)
)

print(
    "Balanced Accuracy:",
    balanced_accuracy_score(y_test, y_pred)
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        labels=[0, 1],
        target_names=["No", "Yes"],
        zero_division=0
    )
)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# =====================================================
# 12. MENYIMPAN MODEL
# =====================================================

os.makedirs("ml/models", exist_ok=True)

joblib.dump(
    best_model,
    MODEL_PATH
)

print("\nModel berhasil disimpan!")
print("Lokasi:", MODEL_PATH)
print("Jumlah fitur input:", len(feature_columns))
