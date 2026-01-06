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
