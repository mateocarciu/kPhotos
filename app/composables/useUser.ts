export const useUser = () => {
  const userStore = useUserStore()

  return {
    user: computed(() => userStore.profile),
    isLoggedIn: computed(() => userStore.isLoggedIn),
    isLoading: computed(() => userStore.isLoading),
    fetchProfile: userStore.fetchProfile,
    login: userStore.login,
    logout: userStore.logout
  }
}
