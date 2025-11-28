import re
import json

try:
    with open(r'C:\week1\skill.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all path d attributes
    # Assuming they are like <path ... d="M..." ... />
    # We want to capture the 'd' value.
    # Also need to check if there are any specific styles or classes associated, but for now just the geometry.
    
    # Regex for path d
    paths = re.findall(r'<path[^>]*d="([^"]+)"', content)
    
    # Also extract stroke width or color if possible, but usually it's standard.
    # The user wants "lines".
    
    print(json.dumps(paths, indent=2))

except Exception as e:
    print(f"Error: {e}")
