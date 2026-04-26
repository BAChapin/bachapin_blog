/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0D0D',
        surface: '#111111',
        text: '#EAEAEA',
        muted: '#888888',
        accent: '#00FF9C',
        divider: '#1F1F1F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['IBM Plex Serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        prose: '65ch',
        content: '720px',
        wide: '900px',
      },
    },
  },
};
