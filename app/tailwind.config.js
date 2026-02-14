/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                'ballog-orange': '#FF7E67',
                'ballog-gray': '#F9F9F9',
            },
            fontFamily: {
                quicksand: ["Quicksand_400Regular", "sans-serif"],
                "quicksand-medium": ["Quicksand_500Medium", "sans-serif"],
                "quicksand-bold": ["Quicksand_700Bold", "sans-serif"],
            },
        },
    },
    plugins: [],
}
