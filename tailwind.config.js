/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#EBB446',
                    light: '#F3CA7A',
                    dark: '#D4992B'
                },
                secondary: {
                    DEFAULT: '#2C516D',
                    light: '#3D6D8F',
                    dark: '#1E3A4F'
                },
            },
        },
    },
    plugins: [],
};
