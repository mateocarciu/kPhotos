import { fetchProfile, login, logout } from '~/services/userService'
import type { UserProfile } from '~/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    isLoading: false
  }),
  getters: {
    isLoggedIn: (state) => !!state.profile
  },
  actions: {
    clearProfile() {
      this.profile = null
    },
    async fetchProfile() {
      this.isLoading = true
      const { data } = await fetchProfile()
      if (data?.profile) this.profile = data.profile
      this.isLoading = false
    },
    async login(token: string) {
      const toast = useToast()
      this.isLoading = true
      const { data, error } = await login(token)
      if (data?.profile) {
        this.profile = data.profile
        toast.add({ title: 'Logged in', color: 'success' })
        navigateTo('/dashboard')
      } else {
        toast.add({ title: 'Login failed', color: 'error' })
      }
      this.isLoading = false
    },
    async logout() {
      await logout()
      this.clearProfile()
      navigateTo('/login')
    }
  }
})
