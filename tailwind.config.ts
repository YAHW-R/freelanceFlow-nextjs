// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-down': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'fade-in-left': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
                'subtle-pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-in-out',
                'fade-in-down': 'fade-in-down 0.5s ease-in-out',
                'fade-in-left': 'fade-in-left 0.5s ease-in-out',
                'subtle-pulse': 'subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
};

export default config;