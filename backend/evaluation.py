import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer, util

# The following statements are need to be ran only once
# nltk.download("punkt_tab")
# nltk.download("punkt")
# nltk.download("stopwords")
# nltk.download("wordnet")

def preprocess_text(text: str):
    lemmatizer = WordNetLemmatizer()
    tokens = word_tokenize(text.lower())
    stop_words = set(stopwords.words("english"))
    cleaned_tokens = [
        lemmatizer.lemmatize(token)
        for token in tokens
        if token.isalpha() and token not in stop_words
    ]

    return cleaned_tokens

def keyword_matching(model_answer, student_answer):
    score = 0
    matched_keywords = set()
    processed_model = preprocess_text(model_answer)
    processed_student = preprocess_text(student_answer)

    for keyword in processed_model:
        if keyword in processed_student:
            matched_keywords.add(keyword)

    # returns matched_keywords and keyword overlap
    return matched_keywords, len(matched_keywords) / len(processed_model)

def semantic_similarity(model_answer, student_answer):
    model = SentenceTransformer("all-MiniLM-L6-v2")

    embedding_1 = model.encode(model_answer, convert_to_tensor=True)
    embedding_2 = model.encode(student_answer, convert_to_tensor=True)

    cosine_score = util.cos_sim(embedding_1, embedding_2)

    return cosine_score.item()

if __name__ == "__main__":
    model_text = """Children make mistakes in dark"""
    student_text = """I am batman. Gotham city needs me."""

    print(semantic_similarity(model_text, student_text))