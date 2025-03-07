import React, { useState, useRef } from 'react';

const ColorDetectionApp = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
      processImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Process the image to extract colors
  const processImage = (imgSrc) => {
    setIsLoading(true);
    setError(null);
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      // Create canvas to process the image
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Extract colors using a simplified k-means approach
      extractDominantColors(canvas, 5)
        .then(dominantColors => {
          const namedColors = dominantColors.map(color => ({
            ...color,
            name: findColorName(color.rgb)
          }));
          setColors(namedColors);
          setIsLoading(false);
        })
        .catch(err => {
          setError("Failed to process image: " + err.message);
          setIsLoading(false);
        });
    };
    
    img.onerror = () => {
      setError("Failed to load image");
      setIsLoading(false);
    };
    
    img.src = imgSrc;
  };
  
  // Extract dominant colors using a simplified clustering approach
  const extractDominantColors = (canvas, colorCount) => {
    return new Promise((resolve) => {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const pixelCount = canvas.width * canvas.height;
      const sampleSize = Math.max(1, Math.floor(pixelCount / 10000));
      
      const samples = [];
      for (let i = 0; i < pixelCount; i += sampleSize) {
        const offset = i * 4;
        if (pixels[offset + 3] < 128) continue;
        samples.push({
          r: pixels[offset],
          g: pixels[offset + 1],
          b: pixels[offset + 2]
        });
      }
      
      const colorMap = new Map();
      samples.forEach(pixel => {
        const quantized = `${Math.floor(pixel.r / 10) * 10},${Math.floor(pixel.g / 10) * 10},${Math.floor(pixel.b / 10) * 10}`;
        colorMap.set(quantized, (colorMap.get(quantized) || 0) + 1);
      });
      
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount)
        .map(entry => {
          const [r, g, b] = entry[0].split(',').map(Number);
          return {
            rgb: { r, g, b },
            hex: rgbToHex(r, g, b),
            frequency: entry[1]
          };
        });
      
      resolve(sortedColors);
    });
  };
  
  // Find the closest named color (simplified)
  const findColorName = (rgb) => {
    const namedColors = [
      { name: "Red", r: 255, g: 0, b: 0 },
      { name: "Green", r: 0, g: 255, b: 0 },
      { name: "Blue", r: 0, g: 0, b: 255 },
      { name: "Black", r: 0, g: 0, b: 0 },
      { name: "White", r: 255, g: 255, b: 255 },
      { name: "Yellow", r: 255, g: 255, b: 0 },
      { name: "Cyan", r: 0, g: 255, b: 255 },
      { name: "Magenta", r: 255, g: 0, b: 255 },
      { name: "Orange", r: 255, g: 165, b: 0 },
      { name: "Purple", r: 128, g: 0, b: 128 },
      { name: "Pink", r: 255, g: 192, b: 203 },
      { name: "Brown", r: 165, g: 42, b: 42 },
      { name: "Gray", r: 128, g: 128, b: 128 }
    ];
    
    let minDistance = Number.MAX_VALUE;
    let closestColor = "Unknown";
    
    namedColors.forEach(color => {
      const distance = Math.sqrt(
        Math.pow(rgb.r - color.r, 2) +
        Math.pow(rgb.g - color.g, 2) +
        Math.pow(rgb.b - color.b, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color.name;
      }
    });
    
    return closestColor;
  };
  
  // RGB to HEX conversion
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase();
  };
  
  // Handle camera capture
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        setTimeout(() => {
          const canvas = canvasRef.current;
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0);
          stream.getTracks().forEach(track => track.stop());
          const capturedImage = canvas.toDataURL('image/png');
          setImageUrl(capturedImage);
          processImage(capturedImage);
        }, 300);
      };
    } catch (err) {
      setError("Camera access denied or not available: " + err.message);
    }
  };
  
  // Copy color HEX code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(`Copied ${text} to clipboard!`))
      .catch(err => console.error('Failed to copy: ', err));
  };
  
  return (
    <div className="container">
      <h1 className="title">AI Color Detection App</h1>
      
      <div className="buttons">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          className="button upload"
        >
          Upload Image
        </button>
        <button 
          onClick={handleCameraCapture}
          className="button camera"
        >
          Use Camera
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading"><p>Processing image...</p></div>}
      
      <div className="image-preview">
        {imageUrl && (
          <>
            <h2>Image Preview</h2>
            <img src={imageUrl} alt="Uploaded for color detection" />
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
      
      {colors.length > 0 && (
        <div className="colors">
          <h2>Detected Colors</h2>
          {colors.map((color, index) => (
            <div key={index} className="color-card">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: color.hex }}
              ></div>
              <div className="color-details">
                <p className="color-name">{color.name}</p>
                <p>HEX: {color.hex}</p>
                <p>RGB: ({color.rgb.r}, {color.rgb.g}, {color.rgb.b})</p>
              </div>
              <button 
                onClick={() => copyToClipboard(color.hex)}
                className="copy-button"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorDetectionApp;
