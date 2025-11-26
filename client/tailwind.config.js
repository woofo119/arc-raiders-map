/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom dark theme colors for ARC Raiders vibe
                'arc-dark': '#121212',
                'arc-gray': '#1E1E1E',
                'arc-accent': '#FF4500', // Example accent color
            }
        },
    },
    plugins: [],
}
