// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  app: {
    head: {
      title: 'kPhotos',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxt/test-utils', '@nuxt/fonts', '@pinia/nuxt', '@nuxthub/core'],

  css: ['~/assets/css/main.css'],

  image: {
    providers: {
      selfhost: {
        name: 'thumbnails',
        provider: '~/providers/thumbnails.ts',
        options: {
          baseUrl: ''
        }
      }
    },
    provider: 'thumbnails'
  },
  compatibilityDate: '2024-11-27'
})
