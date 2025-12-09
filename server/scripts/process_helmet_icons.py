import os
from PIL import Image, ImageOps, ImageEnhance

# Source image path (New generated icon)
SOURCE_PATH = r'C:/Users/B/.gemini/antigravity/brain/c46e359b-8414-4fb9-b045-655763ca451c/styled_helmet_icon_1765288328642.png'
# Output directory
OUTPUT_DIR = r'c:/week1/client/public/ranks'

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Colors definitions (R, G, B)
COLORS = {
    'grey': (180, 180, 180),   # Lighter grey
    'green': (50, 230, 80),    # Neon green
    'blue': (60, 140, 255),    # Bright blue
    'pink': (255, 100, 200),   # Hot pink
    'yellow': (255, 230, 50)   # Bright yellow
}

def process_helmet_icons():
    try:
        print(f"Loading image from {SOURCE_PATH}")
        img = Image.open(SOURCE_PATH).convert("RGBA")
        
        # Resize to standard icon size
        img.thumbnail((256, 256), Image.Resampling.LANCZOS)
        
        # REMOVE BLACK BACKGROUND
        # Strategy: Calculate visual brightness. If very dark, make transparent.
        datas = img.getdata()
        new_data = []
        for item in datas:
            # item is (r, g, b, a)
            # If simplistic black/dark background removal:
            if item[0] < 30 and item[1] < 30 and item[2] < 30:
                new_data.append((0, 0, 0, 0)) # Transparent
            else:
                new_data.append(item)
        img.putdata(new_data)

        # Ensure we have a good base for tinting
        # Convert non-transparent parts to grayscale
        # Split alpha
        alpha = img.split()[3]
        gray = ImageOps.grayscale(img)
        
        # Create variants
        for name, color_rgb in COLORS.items():
            # Colorize (black -> black/transparent base, white -> target color)
            # We want the icon content (which was white/grey) to become the target color
            # The background is already transparent in 'alpha' channel
            
            # Re-apply color map
            colored = ImageOps.colorize(gray, black=(20, 20, 20), white=color_rgb)
            
            # Put alpha back
            colored.putalpha(alpha)
            
            # Enhance
            enhancer = ImageEnhance.Contrast(colored)
            colored = enhancer.enhance(1.1)
            
            save_path = os.path.join(OUTPUT_DIR, f'rank_{name}.png')
            colored.save(save_path)
            print(f'Saved {save_path}')
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    process_helmet_icons()
