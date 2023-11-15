import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  mode: "spa",

  // Target: https://go.nuxtjs.dev/config-target

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s ',
    title: 'Charge24 mpesa payment',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.PNG' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  googleFonts: {
    download: true,
    families: {
      Lato: true,
    },
    display: "Lato",
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    "@nuxtjs/google-fonts",
    '@nuxtjs/moment',

  ],
  moment: {
    timezone: false
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/dayjs',
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyD90O7UdCwrX-KGiBSElhNrJiWeTXtd9b4",
          authDomain: "charge24-ab72d.firebaseapp.com",
          projectId: "charge24-ab72d",
          storageBucket: "charge24-ab72d.appspot.com",
          messagingSenderId: "124534944554",
          appId: "1:124534944554:web:7d4bf62a90602e9a9be453",
          measurementId: "G-VXQH26615L"
        },
        services: {
          auth: {
            persistence: "local", // default
            initialize: {
              nAuthStateChangedMutation: "ON_AUTH_STATE_CHANGED_MUTATION",
              subscribeManually: false,
            },
            ssr: false, // default
          }, // authentication
          firestore: true, // firestoreDb
          storage: true,
          realtimeDb: true// storage./ Just as example. Can be any other service.
        },
      },
    ],
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
