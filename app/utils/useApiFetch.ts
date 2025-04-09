export async function useApiFetch<T>(url: string, options: any = {}) {
  const userStore = useUserStore()

  try {
    const data = await $fetch<T>(url, {
      credentials: 'include',
      ...options
    })

    return { data, error: null }
  } catch (error: any) {
    if (error?.statusCode === 401) {
      userStore.logout()
    }

    console.error('API Fetch Error:', error)
    return { data: null, error }
  }
}
