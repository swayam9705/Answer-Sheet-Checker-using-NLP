from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import pytesseract
from pypdf import PdfReader
import docx
from io import BytesIO
import traceback
import os
from pydantic import BaseModel
from nlp_comparison import compare_answers_nlp
from text_preprocessing import clean_extracted_text, get_text_quality_score, get_improvement_suggestions
import cv2
import numpy as np

app = FastAPI()

# Set path to your Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Pydantic models for API
class TextComparisonRequest(BaseModel):
    model_text: str
    student_text: str

class TextComparisonResponse(BaseModel):
    overall_score: float
    grade: str
    detailed_scores: dict
    weights: dict
    feedback: str
    model_text_length: int
    student_text_length: int

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def preprocess_for_ruled_pages(image):
    """
    Advanced preprocessing for ruled pages - removes horizontal and vertical lines
    """
    # Convert PIL to OpenCV format
    if isinstance(image, Image.Image):
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        # Convert to numpy array
        img_array = np.array(image)
        # Convert RGB to BGR for OpenCV
        img = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    else:
        img = image.copy()
    
    print("🖼️ Starting ruled page preprocessing...")
    
    # Step 1: Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Step 2: Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # Step 3: Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # Step 4: Create horizontal kernel for line detection
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
    
    # Step 5: Detect horizontal lines
    horizontal_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)
    
    # Step 6: Create vertical kernel for line detection
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
    
    # Step 7: Detect vertical lines
    vertical_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, vertical_kernel, iterations=2)
    
    # Step 8: Combine horizontal and vertical lines
    ruled_lines = cv2.add(horizontal_lines, vertical_lines)
    
    # Step 9: Dilate to make lines thicker (easier to remove)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilated_lines = cv2.dilate(ruled_lines, kernel, iterations=1)
    
    # Step 10: Remove lines from original image
    # Create mask for lines
    lines_mask = cv2.bitwise_not(dilated_lines)
    
    # Apply mask to original grayscale image
    cleaned_image = cv2.bitwise_and(gray, gray, mask=lines_mask)
    
    # Step 11: Apply additional noise removal
    cleaned_image = cv2.medianBlur(cleaned_image, 3)
    
    # Step 12: Enhance contrast
    cleaned_image = cv2.convertScaleAbs(cleaned_image, alpha=1.2, beta=10)
    
    print("✅ Ruled page preprocessing completed")
    
    return cleaned_image

def ocr_image_enhanced(image, detect_ruled_lines=True):
    """
    Enhanced OCR function with ruled line detection and removal
    """
    try:
        print(f"🔍 Processing image with OCR (Ruled line removal: {detect_ruled_lines})")
        
        if detect_ruled_lines:
            # Apply ruled line removal preprocessing
            processed_image = preprocess_for_ruled_pages(image)
            
            # Convert back to PIL Image for Tesseract
            pil_image = Image.fromarray(processed_image)
        else:
            # Use original image
            if image.mode != 'RGB':
                pil_image = image.convert('RGB')
            else:
                pil_image = image
        
        # Enhanced OCR settings for better accuracy
        config = '--psm 6 --oem 3 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?;:()[]{}"\'- '
        
        # Run OCR
        text = pytesseract.image_to_string(pil_image, lang='eng', config=config)
        
        print(f"📝 OCR extracted {len(text)} characters")
        
        # Clean up the text
        text = text.strip()
        
        return text
    
    except Exception as e:
        print(f"❌ OCR error: {str(e)}")
        return f"OCR Error: {str(e)}"

def extract_text_from_image_bytes_enhanced(image_bytes, detect_ruled_lines=True):
    """
    Enhanced image text extraction with ruled line handling
    """
    try:
        # Open image
        image = Image.open(BytesIO(image_bytes))
        
        # Extract text with enhanced OCR
        raw_text = ocr_image_enhanced(image, detect_ruled_lines=detect_ruled_lines)
        
        # Clean and preprocess the text
        cleaned_text = clean_extracted_text(raw_text)
        
        print(f"📊 Image OCR: Raw={len(raw_text)} chars, Cleaned={len(cleaned_text)} chars")
        print(f"🎯 Ruled line detection: {'Enabled' if detect_ruled_lines else 'Disabled'}")
        
        return cleaned_text
    
    except Exception as e:
        print(f"❌ Image processing error: {str(e)}")
        return f"Image Processing Error: {str(e)}"

# Legacy function for backward compatibility
def ocr_image(image):
    """Legacy OCR function - use ocr_image_enhanced instead"""
    return ocr_image_enhanced(image, detect_ruled_lines=False)

def extract_text_from_image_bytes(image_bytes):
    """Legacy function - use extract_text_from_image_bytes_enhanced instead"""
    return extract_text_from_image_bytes_enhanced(image_bytes, detect_ruled_lines=False)

def extract_text_from_pdf_bytes(pdf_bytes):
    """Extract text from PDF file bytes."""
    reader = PdfReader(BytesIO(pdf_bytes))
    full_text = ""
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text and text.strip():
            cleaned_text = clean_extracted_text(text)
            full_text += f"\n\n--- Page {i+1} Text ---\n{cleaned_text}"
        else:
            full_text += f"\n\n--- Page {i+1} has no extractable text ---"
    
    # Clean the entire document
    full_text = clean_extracted_text(full_text)
    print(f"PDF extraction: {len(full_text)} characters")
    return full_text

def extract_text_from_docx_bytes(docx_bytes):
    """Extract text from DOCX file bytes."""
    temp_doc_path = "temp_doc.docx"
    with open(temp_doc_path, 'wb') as f:
        f.write(docx_bytes)
    doc = docx.Document(temp_doc_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    text = '\n'.join(full_text)
    
    # Clean up temp file
    if os.path.exists(temp_doc_path):
        os.remove(temp_doc_path)
    
    # Clean the extracted text
    cleaned_text = clean_extracted_text(text)
    print(f"DOCX extraction: Raw={len(text)} chars, Cleaned={len(cleaned_text)} chars")
    return cleaned_text

@app.post("/extractFileText/")
async def extractFileText(file: UploadFile = File(...)):
    try:
        print(f"📁 Processing file: {file.filename}, type: {file.content_type}")
        file_content = await file.read()
        print(f"📊 File size: {len(file_content)} bytes")
        
        extracted_text = ""
        
        # Determine file type and extract text accordingly
        print(f"🔍 File extension: {file.filename.split('.')[-1].lower()}")
        print(f"📄 Content type: {file.content_type}")
        
        if file.filename.lower().endswith(('.png', '.jpeg', '.jpg')):
            print("🖼️ Processing as image with ruled line detection...")
            # Enable ruled line detection for images
            extracted_text = extract_text_from_image_bytes_enhanced(file_content, detect_ruled_lines=True)
        elif file.filename.lower().endswith('.pdf'):
            print("📑 Processing as PDF...")
            extracted_text = extract_text_from_pdf_bytes(file_content)
        elif file.filename.lower().endswith('.docx'):
            print("📄 Processing as DOCX...")
            extracted_text = extract_text_from_docx_bytes(file_content)
        else:
            print(f"❌ Unsupported file type: {file.content_type}")
            return {
                "message": "Unsupported file type",
                "filename": file.filename,
                "type": file.content_type,
                "supported_types": "PNG, JPG, JPEG, PDF, DOCX"
            }
        
        print(f"📝 Extracted text length: {len(extracted_text)} characters")
        
        # Get text quality information
        quality_score = get_text_quality_score(extracted_text)
        suggestions = get_improvement_suggestions(extracted_text)
        
        return {
            "message": "File processed successfully with enhanced OCR",
            "filename": file.filename,
            "size": len(file_content),
            "size_units": "bytes",
            "type": file.content_type,
            "extracted_text": extracted_text.strip() if extracted_text else "No text extracted",
            "text_quality": {
                "score": round(quality_score, 3),
                "suggestions": suggestions
            },
            "ruled_line_removal": True if file.filename.lower().endswith(('.png', '.jpeg', '.jpg')) else False
        }
        
    except Exception as e:
        print(f"❌ Error in file processing: {str(e)}")
        return {
            "message": "Error occurred during processing",
            "error": str(e),
            "traceback": traceback.format_exc()
        }

@app.post("/compareAnswers/", response_model=TextComparisonResponse)
async def compare_answers(request: TextComparisonRequest):
    """
    Compare model and student answers using NLP techniques
    """
    try:
        print(f"🔍 Comparing answers using NLP...")
        print(f"Model text length: {len(request.model_text)} characters")
        print(f"Student text length: {len(request.student_text)} characters")
        
        if not request.model_text.strip() or not request.student_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Both model and student text must be provided and non-empty"
            )
        
        # Perform NLP comparison
        result = compare_answers_nlp(request.model_text, request.student_text)
        
        return TextComparisonResponse(**result)
        
    except Exception as e:
        print(f"Error in NLP comparison: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error during NLP comparison: {str(e)}"
        )

@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    return {
        "message": "Answer Sheet Checker using NLP API",
        "endpoints": {
            "extract_text": "/extractFileText/",
            "compare_answers": "/compareAnswers/",
            "docs": "/docs"
        },
        "supported_file_types": ["PDF", "PNG", "JPG", "JPEG", "DOCX"],
        "nlp_features": [
            "Text preprocessing",
            "Semantic similarity analysis",
            "Keyword overlap detection",
            "Conceptual relevance scoring",
            "Weighted evaluation system"
        ]
    }
