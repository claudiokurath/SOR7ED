/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'sor7ed-yellow': '#F5C614', // Signal Yellow/Gold
                'sor7ed-black': '#000000',
                'sor7ed-gray': '#000000', // Pitch Black
                'sor7ed-gray-light': '#1a1a1a', // Subtle boundary
                'sor7ed-blue': '#3498DB',
                'sor7ed-green': '#2ECC71',
                'sor7ed-red': '#E74C3C',
                'border': '#1a1a1a', // Fix for missing border-border utility
            },
            fontFamily: {
                sans: ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
                'league-gothic': ['League Gothic', 'sans-serif'],
                'roboto': ['Roboto', 'sans-serif'],
                'mono-headline': ['Monaco', 'Menlo', 'monospace'],
                'antarctican': ['antarctican-headline', 'sans-serif'],
            },
            animation: {
                'stealth-glow': 'pulse 8s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
