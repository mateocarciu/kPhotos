export const useUser = () => {
  const userStore = useUserStore()

  return {
    user: computed(() => userStore.getProfile),
    isLoggedIn: computed(() => userStore.isLoggedIn),
    isLoading: computed(() => userStore.isLoading)
  }
}
