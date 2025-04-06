export default defineEventHandler(async (event) => {
  deleteCookie(event, 'user_token')
  return { success: true }
})
