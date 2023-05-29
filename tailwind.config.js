function classNamesToZIndex (classNames) {
  return classNames.reduce((zIndexes, className, index) => {
    zIndexes[className] = index + 1

    return zIndexes
  }, {})
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  theme: {
    screens: {
      sm: '500px',
      tb: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        body: '#1d1d1d',
        base: {
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
          50: '#FAFAF9',
        },
        brand: {
          900: '#623307',
          800: '#6d3c11',
          700: '#78451a',
          600: '#834f23',
          500: '#8e582c',
          400: '#a06c3f',
          300: '#b88b5c',
          200: '#d0ab7a',
          100: '#e8cb92',
          50: '#ffedba',
        },
        brand2: {
          900: '#164E63',
          800: '#155E75',
          700: '#0E7490',
          600: '#0891B2',
          500: '#06B6D4',
          400: '#22D3EE',
          300: '#67E8F9',
          200: '#A5F3FC',
          100: '#CFFAFE',
          50: '#ECFEFF',
        },
        red: '#FF0000',
        blue: '#00BFFF',
        green: '#008000',
        yellow: '#FFFF00',
        black: '#000000',
        white: '#FFFFFF',
        transparent: 'transparent',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        border: 'border',
        opacity: 'opacity',
        visibility: 'visibility',
      },
      zIndex: classNamesToZIndex([
        'post-card-time',
        'card-link',
        'carousel-button',
        'floating-action-app-menu',
        'sort-menu-dropdown',
        'sidebar-menu',
        'app-menu',
        'mobile-menu',
        'video-comments',
        'comment-replies',
        'modal-backdrop',
      ]),
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
