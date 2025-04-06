export const useUser = () => {
  const userStore = useUserStore()

  return {
    user: computed(() => userStore.getProfile),
    isLoggedIn: computed(() => userStore.isLoggedIn)
  }
}
