export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized: No token found' })
  }

  try {
    const res = await $fetch('https://api.infomaniak.com/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res || !res.data) {
      deleteCookie(event, 'user_token')
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }

    return { profile: res.data }
  } catch (error: any) {
    throw createError({ statusCode: error?.response?.status || 500, message: error?.response?.statusText || 'Failed to fetch profile' })
  }
})
