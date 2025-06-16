// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/style.css'],
  modules: ['@nuxt/fonts', 'nuxt-umami'],
  umami: {
    id: process.env.UMAMI_WEBSITE_ID,
    host: 'https://cloud.umami.is/',
    autoTrack: true,
  },
})