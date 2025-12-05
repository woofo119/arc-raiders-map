import os
import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# The file that looks like "蹂댁븞_移⑦빐.png" (Mojibake for 보안_침해)
# I'll just look for any file that is NOT in my expected list and assume it is the one, 
# OR I can try to match it.
# Listing dir to be safe.

files = os.listdir('.')
correct_name = "보안_침해.png"

for f in files:
    # Check for the known garbled name or anything that isn't ASCII and not one of the correct ones if possible
    # But simpler: if file starts with "蹂"
    if f.startswith("蹂"):
        try:
            os.rename(f, correct_name)
            print(f"Fixed {f} to {correct_name}")
        except Exception as e:
            print(f"Error renaming {f} to {correct_name}: {e}")
