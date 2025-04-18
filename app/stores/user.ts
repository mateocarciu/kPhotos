import { fetchProfile, login, logout } from '~/services/userService'
import type { UserProfile } from '~/types'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref(false)
  const tokenCookie = useCookie('user_token').value

  const isLoggedIn = ref(!!tokenCookie?.length)

  const clearProfile = () => {
    profile.value = null
  }

  const fetchProfileAction = async () => {
    isLoading.value = true
    const { data } = await fetchProfile()
    if (data?.profile) profile.value = data.profile
    isLoading.value = false
  }

  const loginAction = async (token: string) => {
    const toast = useToast()
    isLoading.value = true
    const { data } = await login(token)
    if (data?.profile) {
      profile.value = data.profile
      isLoggedIn.value = true
      toast.add({ title: 'Logged in', color: 'success' })
      navigateTo('/')
    } else {
      toast.add({ title: 'Login failed', color: 'error' })
    }
    isLoading.value = false
  }

  const logoutAction = async () => {
    await logout()
    isLoggedIn.value = false
    clearProfile()
    navigateTo('/login')
  }

  return {
    profile,
    isLoading,
    isLoggedIn,
    fetchProfile: fetchProfileAction,
    login: loginAction,
    logout: logoutAction,
    clearProfile
  }
})
