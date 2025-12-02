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
    
    # Threshold for black icon (make WHITE)
    black_threshold = 100
    is_black = (data[:, :, 0] < black_threshold) & \
               (data[:, :, 1] < black_threshold) & \
               (data[:, :, 2] < black_threshold)

    # Apply changes
    # Make white transparent
    data[is_white] = [0, 0, 0, 0]
    
    # Make black WHITE (255, 255, 255, 255)
    data[is_black] = [255, 255, 255, 255]

    # Create new image
    new_img = Image.fromarray(data)
    new_img.save(output_path, "PNG")
    print(f"Processed image saved to {output_path}")

if __name__ == "__main__":
    # Use the file currently in the icons folder (the one user provided/reverted to)
    input_file = r"c:\week1\client\public\icons\icon_security_locker.png"
    output_file = r"c:\week1\client\public\icons\icon_security_locker.png"
    process_icon(input_file, output_file)
