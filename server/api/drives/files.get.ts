import type { ApiResponse, DriveFile } from '@/types'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')
  const query = getQuery(event)
  const cursor = query.cursor as string | undefined
  const order_by = query.order_by ?? ['added_at']
  const order = query.order ?? 'desc'
  const limit = query.limit ?? 20

  const drive_id = query.drive_id as string

  if (!drive_id) {
    throw createError({ statusCode: 400, message: 'Drive ID and File ID are required' })
  }

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const response = await $fetch<ApiResponse<{ data: DriveFile[] }>>(`https://api.infomaniak.com/3/drive/${drive_id}/files/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        // directory_id: file_id, // le dossier actuel
        // types: ['image', 'video'],
        // order_by: ['last_modified_at'],
        cursor,
        limit
      }
    })

    return response
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error) {
      const responseError = error as { response: { status: number; statusText: string } }
      throw createError({ statusCode: responseError.response.status || 500, message: responseError.response.statusText || 'Failed to fetch files' })
    }
    throw createError({ statusCode: 500, message: 'An unknown error occurred' })
  }
})
