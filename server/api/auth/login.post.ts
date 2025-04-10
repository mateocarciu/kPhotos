export default defineEventHandler(async (event) => {
  const body = await readBody<{ token: string }>(event)

  if (!body?.token) {
    throw createError({ statusCode: 400, message: 'Token is required' })
  }

  try {
    const res = await $fetch('https://api.infomaniak.com/profile', {
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
  } catch (error: any) {
    throw createError({ statusCode: error?.response?.status || 500, message: error?.response?.statusText || 'Failed to fetch profile' })
  }
})
