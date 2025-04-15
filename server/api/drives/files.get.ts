// import { ApiResponse } from './../../../app/types/index';
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

  try {
    const response = await $fetch(`https://api.infomaniak.com/3/drive/${drive_id}/files/${file_id}/files`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response
  } catch (error: any) {
    throw createError({ statusCode: error?.response?.status || 500, message: error?.response?.statusText || 'Failed to fetch files' })
  }
})
