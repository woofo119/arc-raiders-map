from PIL import Image
import numpy as np

def process_icon(input_path, output_path):
    # Load image
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Threshold for white background (make transparent)
    white_threshold = 200
    is_white = (data[:, :, 0] > white_threshold) & \
               (data[:, :, 1] > white_threshold) & \
               (data[:, :, 2] > white_threshold)
    
    # Keep black as black (or ensure it is black)
    # We just make white transparent.
    
    # Apply changes
    data[is_white] = [0, 0, 0, 0]
    
    # Create new image
    new_img = Image.fromarray(data)
    new_img.save(output_path, "PNG")
    print(f"Processed image saved to {output_path}")

if __name__ == "__main__":
    # Use the ORIGINAL uploaded jpg to ensure we have the shape
    input_file = r"C:\Users\B\.gemini\antigravity\brain\7ccb8d4f-8481-4543-b303-c59236e68a27\uploaded_image_1764588715206.jpg"
    output_file = r"c:\week1\client\public\icons\icon_security_locker.png"
    process_icon(input_file, output_file)
