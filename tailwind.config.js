/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'bg-primary':     'var(--bg-primary)',
        'bg-secondary':   'var(--bg-secondary)',
        'bg-elevated':    'var(--bg-elevated)',
        'bg-highlight':   'var(--bg-highlight)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',
        'border-subtle':  'var(--border-subtle)',
        'brand-green':    'var(--green)',
      },
    },
  },
  plugins: [],
};