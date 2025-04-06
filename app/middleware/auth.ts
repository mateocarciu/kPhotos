export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  if (!userStore.profile) {
    await userStore.fetchProfile()
  }

  if (!userStore.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }
})
