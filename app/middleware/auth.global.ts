export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // Routes autorisées pour les utilisateurs non connectés
  const publicRoutes = ['/', '/login']

  if (!userStore.profile && userStore.isLoggedIn) {
    userStore.fetchProfile()
  }

  // Cas 1 : Si l'utilisateur n'est pas connecté
  if (!userStore.isLoggedIn) {
    if (!publicRoutes.includes(to.path)) {
      return navigateTo('/login')
    }
  }

  // Cas 2 : Si l'utilisateur est connecté et essaie d'aller sur /login
  if (userStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})
