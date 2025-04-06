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
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }

    return { profile: res.data }
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Failed to fetch profile' })
  }
})
