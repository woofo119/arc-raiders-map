from PIL import Image
import numpy as np
import os

def process_logo(input_path, output_path, is_white_text=False):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        data = np.array(img)

        # Define threshold for white background
        # If text is black (is_white_text=False), we want to remove white background.
        # If text is white (is_white_text=True), we also want to remove white background (assuming the source had a white background or we need to clean it up).
        
        # Actually, for the generated images:
        # logo.png has white background, black text, colored lines.
        # logo_white.png was generated from logo.png but might still have artifacts or background.
        
        # Let's assume background is white (255, 255, 255) or very close to it.
        r, g, b, a = data.T
        
        # Identify white pixels (background)
        white_areas = (r > 240) & (g > 240) & (b > 240)
        
        # Make white pixels transparent
        data[..., 3][white_areas.T] = 0
        
        # Create new image from modified data
        img_transparent = Image.fromarray(data)
        
        # Crop to content
        bbox = img_transparent.getbbox()
        if bbox:
            img_cropped = img_transparent.crop(bbox)
            img_cropped.save(output_path)
            print(f"Saved processed image to {output_path}")
        else:
            print("Error: Image is empty after removing background!")
            
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# Process logo.png (Black text, White BG -> Transparent BG)
process_logo('client/public/logo.png', 'client/public/logo.png', is_white_text=False)

# Process logo_white.png (White text, White BG -> Transparent BG)
# Note: The previous generation for logo_white might have failed to be transparent or had a black background if it was a simple invert. 
# Let's check the source. If I generated it with "White background", I need to remove the white background.
# But wait, if the text is white and background is white, it would be invisible.
# The user's screenshot shows a white square. 
# Let's re-generate the white logo properly using the black one as base if needed, but first let's try to clean the existing one.
# Actually, for logo_white.png, if it was generated with "White background" prompt but asked for white text, the model might have given a dark background or something.
# Let's inspect what I have. 
# To be safe, I will re-create logo_white.png from the processed logo.png.
# 1. Clean logo.png first.
# 2. Create logo_white.png by taking clean logo.png and changing black pixels to white.

def create_white_version(input_path, output_path):
    print(f"Creating white version from {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        data = np.array(img)
        
        r, g, b, a = data.T
        
        # Identify black pixels (text)
        # The colored lines are Cyan, Green, Yellow, Red. We want to keep them.
        # Black text is close to (0,0,0).
        # We need to be careful not to change the dark parts of the colored lines if any.
        # But the lines are bright.
        
        # Define black threshold
        black_areas = (r < 50) & (g < 50) & (b < 50) & (a > 0)
        
        # Change black pixels to white
        data[..., 0][black_areas.T] = 255
        data[..., 1][black_areas.T] = 255
        data[..., 2][black_areas.T] = 255
        
        img_white = Image.fromarray(data)
        img_white.save(output_path)
        print(f"Saved white version to {output_path}")
        
    except Exception as e:
        print(f"Error creating white version: {e}")

# Re-run processing sequence
if os.path.exists('client/public/logo.png'):
    # 1. Clean logo.png
    process_logo('client/public/logo.png', 'client/public/logo.png')
    
    # 2. Create logo_white.png from the cleaned logo.png
    create_white_version('client/public/logo.png', 'client/public/logo_white.png')
else:
    print("client/public/logo.png not found")
