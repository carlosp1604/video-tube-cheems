function classNamesToZIndex (classNames) {
  return classNames.reduce((zIndexes, className, index) => {
    zIndexes[className] = index + 1

    return zIndexes
  }, {})
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  corePlugins: {
    aspectRatio: false,
  },
  theme: {
    container: {
      // you can configure the container to be centered
      center: true,

      // or have default horizontal padding
      padding: '1rem',

      // default breakpoints but with 40px removed
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '1240px',
        '2xl': '1496px',
      },
    },
    screens: {
      sm: '500px',
      tb: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      animation: {
        'bounce-short': 'bounce 0.3s ease-in-out 2',
      },
      boxShadow: {
        all: '0px 0px 10px 2px rgba(0, 0, 0, 0.3)',
      },
      colors: {
        sidebar: {
          item: '#007880',
          active: '#007880',
        },
        body: '#1d1d1d',
        base: {
          950: '#0c0a09',
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
          primary: {
            light: '#b88b5c', // 600
            bg: '#a06c3f', // 700
            dark: '#8e582c', // 800
          },
          secondary: {
            light: '#834f23', // 300
            bg: '#78451a', // 400
            dark: '#6d3c11', // 500
          },
        },
        tooltip: '#6d3c11',
        toast: {
          error: {
            bg: '#DC143C',
            icon: '#FFA07A',
          },
          bg: '#78451a',
          icon: '#b88b5c',
        },
        'progress-bar': '#a06c3f',
        red: '#FF0000',
        blue: '#00BFFF',
        green: '#008000',
        yellow: '#FFFF00',
        black: '#000000',
        white: '#FFFFFF',
        transparent: 'transparent',
      },
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        'max-height': 'max-height',
        border: 'border',
        opacity: 'opacity',
        visibility: 'visibility',
      },
      zIndex: classNamesToZIndex([
        'card-link',
        'post-card-video',
        'post-card-video-time',
        'carousel-button',
        'sort-menu-dropdown',
        'menu-dropdown',
        'video-player',
        'video-player-options',
        'video-player-options-button',
        'video-player-overlay',
        'advertising',
        'video-comments',
        'comment-options',
        'comment-to-reply',
        'comment-replies',
        'floating-action-app-menu',
        'sidebar-menu',
        'top-mobile',
        'app-menu',
        'mobile-menu',
        'tooltip',
        'modal-backdrop',
      ]),
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
