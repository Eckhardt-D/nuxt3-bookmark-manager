// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    databasePath: process.env.DATABASE_PATH,
  }
})
