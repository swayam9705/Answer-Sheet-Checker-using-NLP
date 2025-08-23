from PIL import Image
import pytesseract as pt

def extract_text(img_data: Image):
    try:
        result = pt.image_to_string(img_data)
        return result
    except:
        print("You messed up")
        return "No text detected"
    

if __name__ == "__main__":
    img = Image.open("./demo_images/img2.jpeg")
    print(extract_text(img))