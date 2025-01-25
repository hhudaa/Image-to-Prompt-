import os

from PIL import Image
from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import VisionEncoderDecoderModel, ViTFeatureExtractor, AutoTokenizer
import torch
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)


def predict_step(image_paths):
    model = VisionEncoderDecoderModel.from_pretrained("ImgCaptioning/model")
    feature_extractor = ViTFeatureExtractor.from_pretrained("ImgCaptioning/feature_extractor")
    tokenizer = AutoTokenizer.from_pretrained("ImgCaptioning/tokenizer")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    max_length = 16
    num_beams = 4
    gen_kwargs = {"max_length": max_length, "num_beams": num_beams}

    images = []
    for image_path in image_paths:
        # line break change import setting for image if problem occur
        i_image = Image.open(image_path)
        if i_image.mode != "RGB":
            i_image = i_image.convert(mode="RGB")

        images.append(i_image)

    pixel_values = feature_extractor(images=images, return_tensors="pt").pixel_values
    pixel_values = pixel_values.to(device)
    output_ids = model.generate(pixel_values, **gen_kwargs)
    predictions = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
    predictions = [predictions.strip() for predictions in predictions]

    return predictions


@app.route('/api/UploadImage', methods=['POST'])
def UploadImage():
    if 'imageFile' in request.files:
        image = request.files['imageFile']
        filename = secure_filename(image.filename)  # Get the original filename
        # e.g., save it to disk, perform image recognition, etc.
        image.save(os.path.join('temp_images', filename))
        image_path = os.path.join('temp_images', filename)
        # Process the image as needed
        response = predict_step(['temp_images/' + filename])
        response = jsonify(response)
        response.headers.add('Access-Control-Allow-Origin', '*')
        # Delete the uploaded image
        os.remove(os.path.join('temp_images/', filename))
        print(response.data)
        return response

    else:
        response = jsonify({'message': 'Image Not uploaded successfully!'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@app.route('/')
def hello():
    return "Server is running"


if __name__ == '__main__':
    app.run(debug=True)
