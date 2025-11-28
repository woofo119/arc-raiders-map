import os
import re

# Mocking the SKILL_DATA structure extraction or just reading the file
with open(r'client/src/data/skills.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract icon paths
icons = re.findall(r'icon:\s*["\']([^"\']+)["\']', content)

# Check existence
missing = []
for icon in icons:
    # Icon path is like /sk/filename.png
    # Local path is client/public/sk/filename.png
    local_path = os.path.join('client', 'public', icon.lstrip('/').replace('/', os.sep))
    if not os.path.exists(local_path):
        missing.append(icon)

print(f"Missing icons: {missing}")

# Extract coordinates
# { id: "...", ..., x: 80, y: 25, ... }
coords = re.findall(r'id:\s*["\']([^"\']+)["\'].*?x:\s*([\d\.]+),\s*y:\s*([\d\.]+)', content, re.DOTALL)
coord_map = {}
duplicates = []
for id, x, y in coords:
    key = f"{x},{y}"
    if key in coord_map:
        duplicates.append((key, coord_map[key], id))
    coord_map[key] = id

print(f"Duplicate coordinates: {duplicates}")
