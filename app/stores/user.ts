import type { UserProfile, UserStoreState } from '~/types'

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    profile: null,
    isLoading: false,
    error: null,
    isInitialized: false,
    isInitializing: true
  }),
  getters: {
    isLoggedIn: (state) => !!state.profile,
    getProfile: (state) => state.profile
  },
  actions: {
    clearProfile() {
      this.profile = null
      this.error = null
    },

    async fetchProfile() {
      if (this.isLoading) return
      
      this.isLoading = true
      this.error = null
      
      try {
        const response = await $fetch<{ profile: UserProfile }>('/api/profile')
        if (response?.profile) {
          this.profile = response.profile
        } else {
          throw new Error('No profile data received')
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        this.error = 'Failed to fetch profile'
        this.clearProfile()
        throw err
      } finally {
        this.isLoading = false
        this.isInitialized = true
        this.isInitializing = false
      }
    },
    async login(token: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await $fetch<{ profile: UserProfile }>('/api/auth/login', {
          method: 'POST',
          body: { token }
        })
        
        if (response?.profile) {
          this.profile = response.profile
          navigateTo('/dashboard')
        } else {
          throw new Error('No profile data received')
        }
      } catch (err) {
        console.error('Login failed:', err)
        this.error = 'Login failed'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      this.isLoading = true
      this.error = null
      
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST'
        })
        this.clearProfile()
        navigateTo('/login')
      } catch (err) {
        console.error('Logout failed:', err)
        this.error = 'Logout failed'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
