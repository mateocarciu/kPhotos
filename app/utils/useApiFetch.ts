export async function useApiFetch<T>(url: string, options: Record<string, unknown> = {}) {
  const userStore = useUserStore()

  try {
    const data = await $fetch<T>(url, {
      credentials: 'include',
      ...options
    })

    return { data, error: null }
  } catch (error: unknown) {
    if ((error as { statusCode?: number })?.statusCode === 401 && userStore.isLoggedIn) {
      await userStore.logout()
    }

    console.error('API Fetch Error:', error)
    return { data: null, error }
  }
}
