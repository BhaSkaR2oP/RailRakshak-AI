from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from ultralytics import YOLO
from pathlib import Path
import os
import tempfile
import cv2

app = Flask(__name__)
CORS(app) # Allow frontend to communicate with this API

# Global model variable
model = None

# Initialize model
def load_model():
    global model
    base_dir = Path(__file__).parent.parent
    
    new_model_path = base_dir / "experiments" / "rail_defect_classification" / "weights" / "best.pt"
    existing_model_path = base_dir / "models" / "best.pt"
    
    model_path = None
    if new_model_path.exists():
        model_path = new_model_path
        print(f"Loading newly trained model from: {model_path}")
    elif existing_model_path.exists():
        model_path = existing_model_path
        print(f"Loading existing model from: {model_path}")
    else:
        print("No trained model found! Please run train.py first.")
        return False
        
    try:
        model = YOLO(str(model_path))
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

# --- HTML Frontend Template for Demo ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RailRakshak AI - Web Demo</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 40px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        h1 { color: #1a73e8; text-align: center; margin-bottom: 5px; }
        p.subtitle { text-align: center; color: #666; margin-bottom: 30px; }
        .upload-area { border: 2px dashed #ccc; border-radius: 8px; padding: 40px 20px; text-align: center; cursor: pointer; transition: 0.3s; margin-bottom: 20px; }
        .upload-area:hover { border-color: #1a73e8; background: #f8fbff; }
        #file-input { display: none; }
        .btn { background: #1a73e8; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 6px; cursor: pointer; width: 100%; transition: 0.3s; }
        .btn:hover { background: #1557b0; }
        .btn:disabled { background: #ccc; cursor: not-allowed; }
        #result-box { margin-top: 30px; padding: 20px; border-radius: 8px; display: none; text-align: center; }
        .result-safe { background: #e6f4ea; color: #137333; border: 1px solid #ceead6; }
        .result-danger { background: #fce8e6; color: #c5221f; border: 1px solid #fad2cf; }
        #preview { max-width: 100%; max-height: 300px; margin-top: 15px; border-radius: 6px; display: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>RailRakshak AI</h1>
        <p class="subtitle">Railway Track Defect Detection Engine</p>
        
        <form id="upload-form">
            <div class="upload-area" onclick="document.getElementById('file-input').click()">
                <p>Click here to select an image of a railway track</p>
                <input type="file" id="file-input" accept="image/*" required>
            </div>
            <img id="preview" src="#" alt="Preview" />
            <button type="submit" id="analyze-btn" class="btn" disabled>Analyze Track Image</button>
        </form>

        <div id="result-box">
            <h2 id="prediction-text"></h2>
            <p id="confidence-text"></p>
        </div>
    </div>

    <script>
        const fileInput = document.getElementById('file-input');
        const preview = document.getElementById('preview');
        const analyzeBtn = document.getElementById('analyze-btn');
        const form = document.getElementById('upload-form');
        const resultBox = document.getElementById('result-box');
        
        // Show image preview
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    analyzeBtn.disabled = false;
                }
                reader.readAsDataURL(this.files[0]);
                resultBox.style.display = 'none'; // hide previous results
            }
        });

        // Handle submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const file = fileInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            analyzeBtn.innerText = 'Analyzing...';
            analyzeBtn.disabled = true;
            resultBox.style.display = 'none';

            try {
                const response = await fetch('/api/predict', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    const predictionText = document.getElementById('prediction-text');
                    const confText = document.getElementById('confidence-text');
                    
                    predictionText.innerText = data.prediction;
                    confText.innerText = `Confidence: ${(data.confidence * 100).toFixed(2)}%`;
                    
                    resultBox.className = data.prediction.toLowerCase().includes('defective') ? 'result-danger' : 'result-safe';
                    resultBox.style.display = 'block';
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Is the server running?');
            } finally {
                analyzeBtn.innerText = 'Analyze Track Image';
                analyzeBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    """Serves the Web Demo UI."""
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/predict', methods=['POST'])
def predict():
    """API Endpoint to analyze an image."""
    global model
    
    if model is None:
        if not load_model():
            return jsonify({"status": "error", "message": "AI Model not loaded/found."}), 500

    if 'image' not in request.files:
        return jsonify({"status": "error", "message": "No image file provided."}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"status": "error", "message": "Empty filename."}), 400

    try:
        # Save the uploaded file to a temporary location
        fd, temp_path = tempfile.mkstemp(suffix=".jpg")
        os.close(fd)
        file.save(temp_path)
            
        # Run inference using YOLOv8
        results = model(temp_path)
        
        # Parse results for classification
        for result in results:
            if result.probs is not None:
                top1_index = result.probs.top1
                confidence = float(result.probs.top1conf.item())
                predicted_class = model.names[top1_index]
                
                # Cleanup temp file
                os.remove(temp_path)
                
                return jsonify({
                    "status": "success",
                    "prediction": predicted_class,
                    "confidence": confidence
                })
                
        # Cleanup temp file if no probs found
        os.remove(temp_path)
        return jsonify({"status": "error", "message": "Model did not output classification probabilities."}), 500

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("Loading YOLO model...")
    load_model()
    print("\n" + "="*50)
    print("🚀 RailRakshak AI Backend & Web Demo is running!")
    print("👉 Open your browser and go to: http://localhost:5000")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=False)
