const daisyui = require('daisyui');
const typography = require('@tailwindcss/typography');

module.exports = {
    dark: 'class',
    mode: 'jit',
    content: [
        './src/**/*.{html,js,svelte,ts}'
    ],
    plugins: [
        typography,
        daisyui
    ],
    daisyui: {
        themes: [
            "business",
        ]
    },
    variants: {
        extend: {},
    },
}
