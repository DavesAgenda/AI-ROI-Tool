/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: '#F48847',
                    black: '#0A0A0A',
                    dark: '#0f172a', // Using Slate 900 as "Dark Blue" for now unless user specifies
                    gray: '#EFEFEF',
                }
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
