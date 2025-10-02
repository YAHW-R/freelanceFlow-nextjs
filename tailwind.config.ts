import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // 1. Define tus keyframes
            keyframes: {
                'fade-in-a': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-down-a': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'fade-in-left-a': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
                'subtle-pulse-a': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                'fade-in-up-a': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
            },
            // 2. Define la clase 'animation' al mismo nivel que 'keyframes'
            animation: {
                'fade-in': 'fade-in-a 0.3s ease-in-out',
                'fade-in-up': 'fade-in-up-a 0.5s ease-in-out',
                'fade-in-down': 'fade-in-down-a 0.5s ease-in-out',
                'fade-in-left': 'fade-in-left-a 0.5s ease-in-out',
                'subtle-pulse': 'subtle-pulse-a 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
};

export default config;