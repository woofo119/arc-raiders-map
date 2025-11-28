const fs = require('fs');
const path = require('path');

const markersPath = path.join(__dirname, '../markers.txt');
const content = fs.readFileSync(markersPath, 'utf8');

const markerRegex = /transform:\s*translate3d\(\s*([\d.]+)px,\s*([\d.]+)px,\s*0px\)[^>]*>[\s\S]*?<img[^>]+src="[^"]*\/([^/"]+)\.png"/g;

let match;
console.log('RawX, RawY');
console.log('-------------------');

while ((match = markerRegex.exec(content)) !== null) {
    const rawX = parseFloat(match[1]);
    const rawY = parseFloat(match[2]);
    const iconName = match[3];

    if (iconName === 'apricot') {
        console.log(`${rawX}, ${rawY}`);
    }
}
