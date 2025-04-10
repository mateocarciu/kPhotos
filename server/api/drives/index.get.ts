export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const drivesResponse = await $fetch('https://calendar.infomaniak.com/api/securedProxy/2/drive/users/current/drives', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const driveId = drivesResponse?.data?.[0]?.drive_id

    if (!driveId) {
      throw createError({ statusCode: 404, message: 'No drive found' })
    }

    const filesResponse = await $fetch(`https://kdrive.infomaniak.com/3/drive/${driveId}/files/5/files?with=capabilities,supported_by,dropbox,dropbox.capabilities,version,conversion_capabilities,users,teams,is_favorite,sharelink,path,categories,external_import&limit=40&order_by=type,mime_type&order_for[type]=asc&order_for[mime_type]=asc`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const updatedFiles = filesResponse.data.map((file: any) => {
      if (file.type === 'file' && ['image', 'video'].includes(file.extension_type)) {
        return {
          ...file,
          path: `https://kdrive.infomaniak.com/2/drive/${driveId}/files/${file.id}/thumbnail?t=${file.last_modified_at}`
        }
      }
      return file
    })

    return {
      result: 'success',
      data: updatedFiles,
      response_at: filesResponse.response_at,
      cursor: filesResponse.cursor,
      has_more: filesResponse.has_more
    }
  } catch (error: any) {
    throw createError({ statusCode: error?.response?.status || 500, message: error?.response?.statusText || 'Failed to fetch drives' })
  }
})
