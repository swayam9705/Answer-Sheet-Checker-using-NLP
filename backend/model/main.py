from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import fitz
import torch

# Load pre-trained processor and model
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-large-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-large-handwritten")

# Move model to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def extract_with_trocr(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    
    for i, page in enumerate(doc):
        pix = page.get_pixmap()
        image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples).convert("L")
        
        # You would need to segment the image into lines or words for optimal TrOCR performance
        # as it is often trained on line-level or word-level images.
        # This requires a separate segmentation step.

        # A simplified example for a single line or small image:
        pixel_values = processor(images=image, return_tensors="pt").pixel_values
        generated_ids = model.generate(pixel_values.to(device))
        generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        full_text += f"\n\n--- Page {i+1} ---\n{generated_text}"

    return full_text

if __name__ == "__main__":
    extract_with_trocr("./demo_pdfs/pdf_1.pdf")