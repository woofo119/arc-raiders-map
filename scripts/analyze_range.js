const fs = require('fs');
const path = require('path');

const markersPath = path.join(__dirname, '../markers.txt');
const content = fs.readFileSync(markersPath, 'utf8');

const markerRegex = /transform:\s*translate3d\(\s*([\d.]+)px,\s*([\d.]+)px,\s*0px\)/g;

let maxX = 0;
let maxY = 0;
let minX = Infinity;
let minY = Infinity;
let count = 0;

let match;
while ((match = markerRegex.exec(content)) !== null) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);

    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    count++;
}

console.log(`Count: ${count}`);
console.log(`X Range: ${minX} to ${maxX}`);
console.log(`Y Range: ${minY} to ${maxY}`);
