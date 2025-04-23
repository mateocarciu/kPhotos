import type { ApiResponse, DriveFile } from '@/types'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')
  const query = getQuery(event)

  const drive_id = query.drive_id as string
  const cursor = query.cursor as string | undefined
  const limit = Number(query.limit ?? 20)

  if (!drive_id) {
    throw createError({ statusCode: 400, message: 'Drive ID is required' })
  }

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const typesRaw = query.types
    const types = typeof typesRaw === 'string' ? [typesRaw] : Array.isArray(typesRaw) ? typesRaw : ['image', 'video']

    const order_by = query.order_by ?? 'last_modified_at'
    const order_dir = query.order_dir ?? 'desc'

    const params = new URLSearchParams()
    if (cursor) params.append('cursor', cursor)
    params.append('limit', limit.toString())
    params.append('order_by[]', String(order_by))
    params.append(`order_for[${order_by}]`, String(order_dir))

    if (query.modified_at) {
      params.append('modified_at', String(query.modified_at))
    }

    types.forEach((t) => params.append('types[]', t))

    const url = `https://api.infomaniak.com/3/drive/${drive_id}/files/search?${params.toString()}`

    const response = await $fetch<ApiResponse<{ data: DriveFile[] }>>(url, {
      headers: { Authorization: `Bearer ${token}` }
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
