
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report
)
from sklearn.dummy import DummyClassifier

# Membaca dataset
df = pd.read_csv("ml/dataset/heart_disease.csv")

# Mengubah target
df["Heart Disease Status"] = (
    df["Heart Disease Status"].map({"No": 0, "Yes": 1})
)

X = df.drop(columns=["Heart Disease Status"])
y = df["Heart Disease Status"]

# Memisahkan atribut numerik dan kategorik
numeric_features = X.select_dtypes(include="number").columns.tolist()
categorical_features = X.select_dtypes(exclude="number").columns.tolist()

# Preprocessing
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="constant", fill_value="Unknown")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features)
])

# Membagi dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Model pembanding
models = {
    "Baseline": DummyClassifier(strategy="most_frequent"),

    "SVM": SVC(
        kernel="rbf",
        C=0.1,
        gamma=0.01,
        class_weight="balanced"
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=42
    )
}

print("=== PERBANDINGAN MODEL ===")

for name, model in models.items():

    pipeline = Pipeline([
        ("preprocessing", preprocessor),
        ("classifier", model)
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    print(f"\n=== {name} ===")

    print(
        "Accuracy:",
        round(accuracy_score(y_test, predictions), 4)
    )

    print(
        "Balanced Accuracy:",
        round(balanced_accuracy_score(y_test, predictions), 4)
    )

    print(
        classification_report(
            y_test,
            predictions,
            target_names=["No", "Yes"],
            zero_division=0
        )
    )
