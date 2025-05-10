export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  // Routes autorisées pour les utilisateurs non connectés
  const publicRoutes = ['/', '/login']

  // console.log('Middleware auth', userStore.isLoggedIn, to.path)

  if (import.meta.client && userStore.isLoggedIn && !userStore.profile) {
    await userStore.fetchProfile()
  }

  // Cas 2 : Si l'utilisateur est connecté et essaie d'aller sur /login
  if (userStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/drives')
  }

  // Cas 1 : Si l'utilisateur n'est pas connecté
  if (!userStore.isLoggedIn) {
    if (!publicRoutes.includes(to.path)) {
      return navigateTo('/login')
    }
  }
})
