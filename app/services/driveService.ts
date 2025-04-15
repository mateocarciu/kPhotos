import type { Drive, DriveFile } from '~/types'
import { useApiFetch } from '~/utils/useApiFetch'

export const fetchDrives = () => useApiFetch<{ data: Drive }>('/api/drives')

export const fetchFiles = (drive_id: string, file_id: string) =>
  useApiFetch<{ data: DriveFile }>('/api/drives/files', {
    params: { drive_id, file_id }
  })
