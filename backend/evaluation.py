import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import spacy
from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer, util
from textblob import TextBlob
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# The following statements are need to be ran only once
# nltk.download("punkt_tab")
# nltk.download("punkt")
# nltk.download("stopwords")
# nltk.download("wordnet")

nlp = spacy.load("en_core_web_md")

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

def _get_tone_score(text: str) -> dict:
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "avg_score": (polarity + subjectivity) / 2
    }

def get_tone(text: str):
    tone_score = _get_tone_score(text)
    pol = tone_score["polarity"]
    sub = tone_score["subjectivity"]
    avg = tone_score["avg_score"]

    if pol > 0.6:
        if sub > 0.6:
            return "Enthusastic & Personal", avg
        else:
            return "Positive & Factual", avg
    elif pol < 0.3:
        if sub > 0.6:
            return "Personal & Critical", avg
        else:
            return "Neutral & Factual", avg
    else:
        if sub > 0.6:
            return "Expressive & Emotional", avg
        else:
            return "Factual & Objective", avg


if __name__ == "__main__":
    text_happy = "I am so excited and overjoyed to finally start my new project!"
    text_anger = "I am furious with the customer service; it was absolutely terrible."
    text_sadness = "I feel so lonely and disappointed after the result."

    print(get_tone(text_happy))