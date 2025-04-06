export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as any
  }),
  getters: {
    isLoggedIn: (state) => !!state.profile,
    getProfile: (state) => state.profile
  },
  actions: {
    clearProfile() {
      this.profile = null
    },

    async fetchProfile() {
      try {
        const response = await $fetch('/api/profile')
        this.profile = response?.profile
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        this.clearProfile()
      }
    },
    async login(token: string) {
      const toast = useToast()

      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { token }
        })
        this.profile = response?.profile
        navigateTo('/dashboard')
        toast.add({
          title: 'Success',
          description: 'Login successful',
          color: 'success'
        })
      } catch (err) {
        console.error('Login failed:', err)
        toast.add({
          title: 'Erreur de connexion',
          description: 'Impossible de se connecter avec ce token',
          color: 'error'
        })
      }
    },
    async logout() {
      const toast = useToast()
      try {
        const response = await $fetch('/api/auth/logout', {
          method: 'POST'
        })
        this.profile = null
        toast.add({
          title: 'Success',
          description: 'Logout successful',
          color: 'success'
        })
      } catch (err) {
        console.error('Logout failed:', err)
        toast.add({
          title: 'An error occurred',
          description: 'Logout failed',
          color: 'error'
        })
      }
    }
  }
})
