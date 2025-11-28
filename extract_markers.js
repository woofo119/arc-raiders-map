const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'markers.txt');
const content = fs.readFileSync(filePath, 'utf8');

// Configuration
const MAP_OFFSET_X = 60;
const MAP_OFFSET_Y = 282;
const MAP_DISPLAY_SIZE = 707;
const MAP_ORIGINAL_SIZE = 1000;

// Regex to find markers
const markerRegex = /<div class="leaflet-marker-icon([^"]*)"[^>]*style="([^"]*)"[^>]*>(.*?)<\/div>/gs;
const imgRegex = /<img[^>]+src="([^"]+)"/;

let match;
const markers = [];

while ((match = markerRegex.exec(content)) !== null) {
    const className = match[1];
    const style = match[2];
    const innerHTML = match[3];

    // Skip zone labels
    if (className.includes('zone-label') || className.includes('custom-text-label')) {
        continue;
    }

    // Extract transform
    const transformMatch = style.match(/translate3d\(([^)]+)\)/);
    if (!transformMatch) continue;

    const transformParts = transformMatch[1].split(',').map(s => parseFloat(s));
    const x = transformParts[0];
    const y = transformParts[1];

    // Calculate coordinates
    // Relative to the map image
    const relX = x - MAP_OFFSET_X;
    const relY = y - MAP_OFFSET_Y;

    // Scale to original size (0-1000)
    // We clamp to 0-1000 just in case, or maybe not? 
    // Let's keep them as is, but maybe round them.
    const finalX = (relX / MAP_DISPLAY_SIZE) * MAP_ORIGINAL_SIZE;
    const finalY = (relY / MAP_DISPLAY_SIZE) * MAP_ORIGINAL_SIZE;

    // Extract type from image src
    const imgMatch = innerHTML.match(imgRegex);
    let type = 'unknown';
    if (imgMatch) {
        const src = imgMatch[1];
        // Example src: /images/markers/mushroom.png
        // We want 'mushroom'
        const filename = src.split('/').pop(); // mushroom.png
        type = filename.split('.')[0]; // mushroom
    } else {
        // If no image, maybe check class or text?
        // For now, skip if no image found, or label as unknown
        continue;
    }

    markers.push({
        type,
        x: finalX,
        y: finalY,
        originalX: x,
        originalY: y
    });
}

console.log(`Extracted ${markers.length} markers.`);

// Write to JSON
fs.writeFileSync(path.join(__dirname, 'extracted_markers.json'), JSON.stringify(markers, null, 2));
console.log('Saved to extracted_markers.json');
