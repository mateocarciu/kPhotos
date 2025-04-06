export async function getUserFromCookie(event) {
  const token = getCookie(event, 'user_token')
  if (!token) return null

  try {
    const profile = await $fetch('https://api.infomaniak.com/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return profile.data
  } catch {
    return null
  }
}
