import type { Drive, DriveFile } from '~/types'
import { useApiFetch } from '~/utils/useApiFetch'

export const fetchDrives = () => useApiFetch<{ data: Drive }>('/api/drives')

export const fetchFiles = (drive_id: string, params?: { cursor?: string; order_by?: string[]; order?: string; limit?: number }) =>
  useApiFetch<{ data: DriveFile[]; cursor?: string; has_more?: boolean }>('/api/drives/files', {
    params: {
      drive_id,
      ...params
    }
  })

export const fetchFolders = (drive_id: string) =>
  useApiFetch<{ data: DriveFile[] }>('/api/drives/folders', {
    params: {
      drive_id
    }
  })
