import type { ApiResponse, UserProfile } from '@/types'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized: No token found' })
  }

  try {
    const res = await $fetch<ApiResponse<{ profile: UserProfile }>>('https://api.infomaniak.com/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res || !res.data) {
      deleteCookie(event, 'user_token')
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }

    return { profile: res.data }
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error) {
      const response = (error as { response?: { status?: number; statusText?: string } }).response
      throw createError({ statusCode: response?.status || 500, message: response?.statusText || 'Failed to fetch profile' })
    }
    throw createError({ statusCode: 500, message: 'An unknown error occurred' })
  }
})
