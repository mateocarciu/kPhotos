export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')
  const query = getQuery(event)

  const drive_id = query.drive_id as string
  const file_id = query.file_id as string
  const width = query.width || 400
  const height = query.height || 400

  if (!drive_id || !file_id) {
    throw createError({ statusCode: 400, message: 'Drive ID and File ID are required' })
  }

  const url = `https://api.infomaniak.com/2/drive/${drive_id}/files/${file_id}/thumbnail?width=${width}&height=${height}`

  const res = await $fetch.raw(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'stream'
  })

  const response = event.node.res
  for (const [key, value] of Object.entries(res.headers)) {
    response.setHeader(key, String(value))
  }

  return res.body
})
