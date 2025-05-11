export default defineEventHandler((event) => {
  const publicRoutes = ['/api/auth/login']
  const path = event.node.req.url

  if (publicRoutes.some((route) => path?.startsWith(route))) {
    return
  }

  if (path?.startsWith('/api')) {
    const token = getCookie(event, 'user_token')

    if (!token) {
      throw createError({ statusCode: 401, message: 'Unauthorized: No token found' })
    }
  }
})
