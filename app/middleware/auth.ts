export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  if (to.path === '/login') {
    if (userStore.isLoggedIn) {
      return navigateTo('/dashboard')
    }
    return
  }

  if (!userStore.isLoggedIn) {
    try {
      await userStore.fetchProfile()

      if (!userStore.isLoggedIn) {
        return navigateTo('/login')
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
      return navigateTo('/login')
    }
  }
})
