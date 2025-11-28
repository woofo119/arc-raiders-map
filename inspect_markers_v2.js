const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'markers.txt');
const content = fs.readFileSync(filePath, 'utf8');

// Regex to find leaflet-marker-icons
// We capture the class, style (for transform), and inner content
// Note: This regex assumes the div ends with </div></div> which might not be robust for all cases, 
// but based on the file structure seen so far, it might work.
// A better approach for the inner content is to capture until the next <div class="leaflet-marker-icon
// or just a reasonable amount of characters.

const markerRegex = /<div class="leaflet-marker-icon([^"]*)"[^>]*style="([^"]*)"[^>]*>(.*?)<\/div>/gs;

let match;
let count = 0;
const foundMarkers = [];

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
    const transform = transformMatch ? transformMatch[1] : 'N/A';

    foundMarkers.push({
        className,
        transform,
        innerHTML: innerHTML.trim().substring(0, 200) // Truncate inner HTML
    });

    count++;
    if (count >= 20) break; // Just look at first 20 non-zone markers
}

console.log('Found Markers (non-zone):', foundMarkers);
