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

from PIL import Image
from io import BytesIO
from random import randint
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.post("/modelFile/")
async def model_file(file: UploadFile = File(...)):
    try:
        if file.content_type.startswith("image/"):
            contents = await file.read()
            pil_image = Image.open(BytesIO(contents)).convert('L')
            pil_image.save(f"./demo_images/{randint(10, 99)}--{randint(10, 99)}.jpeg")
            print(np.array(pil_image))
        

        return {
            "message": "file recieved",
            "filename": file.filename,
            "size": file.size,
            "size_units": "bytes",
            "type": file.content_type,
        }
    except:
        return {
            "message": "Error occurred"
        }
