const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'markers.txt');
const content = fs.readFileSync(filePath, 'utf8');

// Find map layer transform
const mapLayerRegex = /leaflet-image-layer.*?transform:\s*translate3d\(([^)]+)\)/;
const mapMatch = content.match(mapLayerRegex);
if (mapMatch) {
    console.log('Map Layer Transform:', mapMatch[1]);
} else {
    console.log('Map Layer not found');
}

// Find markers
const markerRegex = /<div class="leaflet-marker-icon.*?transform:\s*translate3d\(([^)]+)\).*?>\s*<div.*?>\s*(.*?)\s*<\/div>\s*<\/div>/gs;
// Note: The regex above is simple and might not match complex nested divs perfectly, but good enough for inspection if structure is consistent.
// Actually, let's just find the position of "Mushroom" and print surrounding text.

const keyword = "Mushroom";
let index = content.indexOf(keyword);
while (index !== -1) {
    const start = Math.max(0, index - 300);
    const end = Math.min(content.length, index + 300);
    console.log(`\n--- Match at ${index} ---`);
    console.log(content.substring(start, end));
    index = content.indexOf(keyword, index + 1);
}
