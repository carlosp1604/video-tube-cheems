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
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.7' },
          '100%': { transform: 'scale(6)', opacity: '0' },
        },
      },
      animation: {
        'bounce-short': 'bounce 0.3s ease-in-out 2',
        'click-ripple': 'ripple 0.5s linear forwards',
      },
      boxShadow: {
        all: '0px 0px 10px 2px rgba(0, 0, 0, 0.3)',
        'all-sm': '0px 0px 4px 2px rgba(0, 0, 0, 0.3)',
      },
      colors: {
        sidebar: {
          item: '#b88b5c',
        },
        body: '#0f0f0f', // '#1d1d1d',
        input: '#121212',
        surface: '#202020',
        text: '#FFFFFF',
        'secondary-text': '#909090',
        border: '#303030',
        hover: '#383838',
        active: '#484848',
        disabled: '#5C5C5C',
        modal: '#282828',
        'click-animation': '#787878',
        base: {
          50: '#F2F2F2',
          100: '#E3E3E3',
          200: '#C9C9C9',
          300: '#ADADAD',
          400: '#949494',
          500: '#787878',
          600: '#5C5C5C',
          700: '#424242',
          800: '#272727',
          900: '#141414',
          950: '#0A0A0A',
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
        tooltip: '#8e582c',
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
        'player-overlay',
        'video-player-options',
        'video-player-options-button',
        'video-player-overlay',
        'advertising',
        'video-comments',
        'comment-options',
        'comment-to-reply',
        'comment-replies',
        'sidebar-menu',
        'top-mobile',
        'app-menu',
        'mobile-menu',
        'tooltip',
        'modal-backdrop',
        'toast',
      ]),
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
