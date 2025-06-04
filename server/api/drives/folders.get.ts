import type { ApiResponse, DriveFile } from '@/types'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')
  const query = getQuery(event)

  const drive_id = query.drive_id as string

  if (!drive_id) {
    throw createError({ statusCode: 400, message: 'Drive ID is required' })
  }

  try {
    const types = ['dir']

    const params = new URLSearchParams()

    types.forEach((t) => params.append('types[]', t))

    const url = `https://api.infomaniak.com/3/drive/${drive_id}/files/search?${params.toString()}`

    const response = await $fetch<ApiResponse<{ data: DriveFile[] }>>(url, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error) {
      const responseError = error as { response: { status: number; statusText: string } }
      throw createError({ statusCode: responseError.response.status || 500, message: responseError.response.statusText || 'Failed to fetch folders' })
    }
    throw createError({ statusCode: 500, message: 'An unknown error occurred' })
  }
})
