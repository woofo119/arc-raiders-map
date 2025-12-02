import { MARKER_CATEGORIES } from './client/src/constants.js';

const filters = Object.values(MARKER_CATEGORIES).reduce((acc, category) => {
    category.types.forEach(type => {
        acc[type.id] = true;
    });
    return acc;
}, {});

console.log('Generated Filters:', filters);

if (filters['weapon_case']) {
    console.log('✅ weapon_case is TRUE');
} else {
    console.log('❌ weapon_case is MISSING or FALSE');
}

if (filters['armor_crate']) {
    console.log('❌ armor_crate should be MISSING');
} else {
    console.log('✅ armor_crate is MISSING (Correct)');
}
