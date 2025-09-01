# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/modelFile/")
# async def upload_model_file(file: UploadFile = File(...)):
#     try:
#         # Here you can add code to save or process the file if needed
#         return {"message": "File received successfully", "filename": file.filename}
#     except Exception as e:
#         return {"error": str(e)}

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from PIL import Image
from io import BytesIO
from random import randint
from PyPDF2 import PdfReader

from extract_text import extract_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

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