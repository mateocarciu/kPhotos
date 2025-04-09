export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()
  // if (!userStore.isLoggedIn) {
  await userStore.fetchProfile()
  //   if (!userStore.isLoggedIn) return navigateTo('/login')
  // }
})
