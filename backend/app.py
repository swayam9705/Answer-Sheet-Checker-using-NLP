from fastapi import FastAPI, File, UploadFile, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Any
from PIL import Image
from io import BytesIO
from PyPDF2 import PdfReader
from pydantic import BaseModel

from evaluation import keyword_matching, semantic_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

class Answers(BaseModel):
    model: str
    student: str

# extract the text from the image received as `file` and return it in the response
@app.post("/extractFileText/")
async def extractFileText(file: UploadFile = File(...)):
    try:
        if file.content_type.startswith("application/pdf"):

            file_content = await file.read()
            pdf_bytes_io = BytesIO(file_content)
            pdf_reader = PdfReader(pdf_bytes_io)
            extracted_text = ""

            for page in pdf_reader.pages:
                extracted_text += " " + page.extract_text() or ""

            return {
                "message": "file recieved",
                "filename": file.filename,
                "size": file.size,
                "size_units": "bytes",
                "type": file.content_type,
                "extracted_text": extracted_text
            }
    except:
        return {
            "message": "Error occured"
        }
    
@app.post("/evaluation/")
async def evaluation(answers: Answers):
    try:
        model_answer = answers.model
        student_answer = answers.student

        (_, percent) = keyword_matching(model_answer, student_answer)

        semantics = semantic_similarity(model_answer, student_answer)

        return {
            "message": "200 OK",
            "keyword": percent,
            "semantics": semantics
        }
    except:
        return {
            "message": "request invalid"
        }
    