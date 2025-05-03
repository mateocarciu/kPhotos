export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')
  const query = getQuery(event)
  const drive_id = query.drive_id as string
  const file_id = query.file_id as string

  if (!drive_id || !file_id) {
    throw createError({ statusCode: 400, message: 'Drive ID and File ID are required' })
  }

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const response = await $fetch.raw(`https://api.infomaniak.com/2/drive/${drive_id}/files/${file_id}/download`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    redirect: 'manual' // pour ne pas suivre la 302
  })

  const location = response.headers.get('location')
  if (!location) {
    throw createError({ statusCode: 500, message: 'No download URL received' })
  }

  // URL de téléchargement réelle
  return sendRedirect(event, location, 302)
})
