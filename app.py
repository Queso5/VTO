from flask import Flask, render_template, request, jsonify, send_from_directory
import base64, io
from PIL import Image
import numpy as np
import cv2
import torch
from torchvision import models, transforms
import os

app = Flask(__name__)

# Initialize the model
model = models.segmentation.deeplabv3_resnet101(pretrained=True).eval()

def overlay_garment_on_body(person_image, garment_image, mask):
    """
    Overlay the garment on the person's image using the segmentation mask
    """
    # Convert PIL Image to numpy array if necessary
    if isinstance(person_image, Image.Image):
        person_np = np.array(person_image)
    else:
        person_np = person_image

    # Resize garment to match person image size
    garment_resized = cv2.resize(garment_image, (person_np.shape[1], person_np.shape[0]))

    # Create binary mask for the person
    person_mask = (mask == 15).astype(np.uint8) * 255  # 15 is typically the person class in DeepLab
    
    # Create inverse mask
    mask_inv = cv2.bitwise_not(person_mask)

    # Extract the background
    person_bg = cv2.bitwise_and(person_np, person_np, mask=mask_inv)

    # Extract the garment area
    garment_fg = cv2.bitwise_and(garment_resized, garment_resized, mask=person_mask)

    # Combine background and garment
    result = cv2.add(person_bg, garment_fg)

    return result

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vton.html')
def vton():
    return render_template('vton.html')

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        data = request.json
        if not data or 'image' not in data or 'garment' not in data:
            return jsonify({'error': 'Missing image or garment data'}), 400

        # Get the image data and garment filename
        image_data = data['image']
        garment_filename = data['garment']

        try:
            # Decode base64 image
            image_data = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
            
            # Convert to PIL Image
            input_image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to tensor for model
            preprocess = transforms.Compose([
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_tensor = preprocess(input_image).unsqueeze(0)
            
            # Get garment image
            garment_path = os.path.join('static', 'garments', garment_filename)
            garment_image = cv2.imread(garment_path)
            
            if garment_image is None:
                raise Exception(f"Could not load garment image: {garment_path}")
            
            # Process with model
            with torch.no_grad():
                output = model(input_tensor)['out'][0]
            mask = output.argmax(0).byte().cpu().numpy()
            
            # Overlay garment
            result_image = overlay_garment_on_body(input_image, garment_image, mask)
            
            # Convert result to base64
            result_pil = Image.fromarray(result_image)
            buffered = io.BytesIO()
            result_pil.save(buffered, format="PNG")
            result_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            return jsonify({
                'result': result_base64,
                'garment': garment_filename
            })

        except Exception as e:
            print(f"Image processing error: {str(e)}")
            return jsonify({'error': 'Image processing failed'}), 500

    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)