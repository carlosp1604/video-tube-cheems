/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  theme: {
    screens: {
      'sm': '500px',
      'tb': '600px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        body: '#121212',
        menu: {
          main: '#a1a1aa',
          highlighted: '#ffffff',
          background: {
            hovered: '#64748b',
            active: '#94a3b8',
          },
        },
        border: {
          main: '#475569',
        },
        footer: {
          main: '#6b7280',
        },
        texts: {
          main: '#f5f5f5',
        }
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif']
      },
      transitionProperty: {
        'width': 'width',
        'border': 'border',
        'opacity': 'opacity'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
}