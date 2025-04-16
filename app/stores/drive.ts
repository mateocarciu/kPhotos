import type { Drive, DriveFile } from '~/types'
import * as driveService from '~/services/driveService'

export const useDriveStore = defineStore('drive', () => {
  const drives = ref<Drive[]>([])
  const files = ref<DriveFile[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchDrives = async () => {
    isLoading.value = true
    error.value = null

    try {
      const res = await driveService.fetchDrives()
      drives.value = Array.isArray(res?.data?.data) ? (res.data.data as Drive[]) : []
    } catch (err) {
      error.value = 'Failed to fetch files'
      console.error('Drive fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchFiles = async (drive_id: string, file_id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await driveService.fetchFiles(drive_id, file_id)
      if (res?.data?.data) {
        files.value = Array.isArray(res.data.data) ? res.data.data : [res.data.data]
      } else {
        error.value = 'File not found'
        console.error('File not found:', file_id)
      }
    } catch (err) {
      error.value = 'Failed to fetch file'
      console.error('File fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    drives,
    files,
    isLoading,
    error,
    fetchFiles,
    fetchDrives
  }
})
