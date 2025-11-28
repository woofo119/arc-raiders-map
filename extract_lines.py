import re
import json

try:
    with open(r'C:\week1\skill.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all line attributes
    # <line x1="..." y1="..." x2="..." y2="..." ... />
    
    # Regex for line
    lines = re.findall(r'<line\s+x1="([\d\.]+)"\s+y1="([\d\.]+)"\s+x2="([\d\.]+)"\s+y2="([\d\.]+)"', content)
    
    # Convert to list of dicts
    line_data = [{'x1': float(l[0]), 'y1': float(l[1]), 'x2': float(l[2]), 'y2': float(l[3])} for l in lines]
    
    print(json.dumps(line_data, indent=2))

except Exception as e:
    print(f"Error: {e}")
