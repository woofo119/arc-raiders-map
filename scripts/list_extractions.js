const fs = require('fs');
const path = require('path');

const markersPath = path.join(__dirname, '../markers.txt');
const content = fs.readFileSync(markersPath, 'utf8');

const markerRegex = /transform:\s*translate3d\(\s*([\d.]+)px,\s*([\d.]+)px,\s*0px\)[^>]*>[\s\S]*?<img[^>]+src="[^"]*\/([^/"]+)\.png"/g;

console.log('Extraction Markers (Raw X, Raw Y)');
console.log('-----------------------------------');

let match;
while ((match = markerRegex.exec(content)) !== null) {
    const rawX = parseFloat(match[1]);
    const rawY = parseFloat(match[2]);
    const iconName = match[3];

    if (iconName === 'extraction') {
        console.log(`${rawX}, ${rawY}`);
    }
}
