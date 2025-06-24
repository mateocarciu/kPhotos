import { useApiFetch } from '~/utils/useApiFetch'
import type { UserProfile } from '~/types'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref(false)
  const tokenCookie = useCookie('user_token').value
  const isLoggedIn = ref(!!tokenCookie?.length)

  const fetchProfileAction = async () => {
    isLoading.value = true
    const { data } = await useApiFetch<{ profile: UserProfile }>('/api/account/profile')
    if (data?.profile) profile.value = data.profile
    isLoading.value = false
  }

  const loginAction = async (token: string) => {
    const toast = useToast()
    isLoading.value = true
    const { data } = await useApiFetch<{ profile: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: { token }
    })
    if (data?.profile) {
      profile.value = data.profile
      isLoggedIn.value = true
      toast.add({ title: 'Logged in', color: 'success' })
      navigateTo('/drives')
    } else {
      toast.add({ title: 'Login failed', color: 'error' })
    }
    isLoading.value = false
  }

  const logoutAction = async () => {
    await useApiFetch('/api/auth/logout', {
      method: 'POST'
    })
    isLoggedIn.value = false
    profile.value = null
    navigateTo('/login')
  }

  return {
    profile,
    isLoading,
    isLoggedIn,
    fetchProfile: fetchProfileAction,
    login: loginAction,
    logout: logoutAction
  }
})
