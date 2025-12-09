import os
from PIL import Image

# Source image path
SOURCE_PATH = r'C:/Users/B/.gemini/antigravity/brain/c46e359b-8414-4fb9-b045-655763ca451c/uploaded_image_1765286210453.jpg'
# Output directory
OUTPUT_DIR = r'c:/week1/client/public/ranks'

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def process_icons():
    try:
        img = Image.open(SOURCE_PATH)
        width, height = img.size
        
        # Accessing 5 icons. Assuming they are evenly spaced horizontally.
        # We'll split the width into 5 chunks.
        chunk_width = width // 5
        
        # Colors map to file names
        colors = ['grey', 'green', 'blue', 'pink', 'yellow']
        
        for i, color in enumerate(colors):
            left = i * chunk_width
            right = (i + 1) * chunk_width
            # Crop the chunk
            icon_chunk = img.crop((left, 0, right, height))
            
            # Trim borders (simple bounding box)
            # Convert to RGBA to handle transparency if it was PNG, but it's JPG.
            # Assuming black/dark background or just crop to content.
            # Since it's JPG, probably no alpha. Let's just center crop or save as is?
            # The user image looks like a render on a grey background. 
            # Ideally we want to remove background, but that's hard with JPG.
            # I will just crop the center square of the chunk to ensure it's icon-focused.
            
            # Let's find the bounding box of non-background logic if possible.
            # Or just save the chunk for now. 
            # Better: Crop a square from the middle of the chunk.
            
            # Current chunk is 204x1024 (approx). The icon is likely in the vertical middle.
            # Let's crop a square 200x200 from the center of the chunk.
            
            center_x = chunk_width // 2
            center_y = height // 2
            half_size = min(chunk_width, height) // 2 - 10 # slightly smaller
            
            # Adjust crop box
            # crop_box = (0, center_y - chunk_width//2, chunk_width, center_y + chunk_width//2)
            # icon_chunk = icon_chunk.crop((0, center_y - chunk_width//2, chunk_width, center_y + chunk_width//2))
            
            # Actually, let's just save the extraction and let the user see.
            # But wait, 1024x1024 with 5 icons means they are quite wide.
            # 1024 / 5 = 204.8 pixels wide.
            # Height is 1024. So they are tall strips. I should crop the vertical center.
            
            crop_top = (height - chunk_width) // 2
            crop_bottom = crop_top + chunk_width
            
            icon_square = icon_chunk.crop((0, crop_top, chunk_width, crop_bottom))
            
            # Resize to something reasonable for web, e.g., 64x64 or 128x128
            # icon_square = icon_square.resize((64, 64), Image.Resampling.LANCZOS)
            
            save_path = os.path.join(OUTPUT_DIR, f'rank_{color}.png')
            icon_square.save(save_path)
            print(f'Saved {save_path}')
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    process_icons()
