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

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxt/test-utils', '@nuxt/fonts', '@pinia/nuxt'],

  // runtimeConfig: {
  //   public: {
  //     infomaniakClientApi: process.env.NUXT_INFOMANIAK_CLIENT_API
  //   }
  // },

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})
