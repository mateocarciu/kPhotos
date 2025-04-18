import type { ApiResponse, UserProfile } from '@/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token: string }>(event)

  if (!body?.token) {
    throw createError({ statusCode: 400, message: 'Token is required' })
  }

  try {
    const res = await $fetch<ApiResponse<{ profile: UserProfile }>>('https://api.infomaniak.com/profile', {
      headers: {
        Authorization: `Bearer ${body.token}`
      }
    })

    if (!res || !res.data) {
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }

    // Set le cookie HttpOnly
    setCookie(event, 'user_token', body.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    return { success: true, profile: res.data }
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error) {
      const response = (error as { response?: { status?: number; statusText?: string } }).response
      throw createError({ statusCode: response?.status || 500, message: response?.statusText || 'Failed to fetch profile' })
    }
    throw createError({ statusCode: 500, message: 'An unknown error occurred' })
  }
})
