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
            {
                "business": {
                    ...require("daisyui/src/colors/themes")["[data-theme=business]"],
                    "accent": "#6366f1",
                },
            },
            "corporate",
        ]
    },
    variants: {
        extend: {},
    },
}
