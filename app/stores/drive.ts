import type { Drive, DriveFile } from '~/types'
import * as driveService from '~/services/driveService'

export const useDriveStore = defineStore('drive', () => {
  const drives = ref<Drive[]>([])
  const files = ref<DriveFile[]>([])
  const cursor = ref<string | null>(null)
  const hasMore = ref(true)
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

  const fetchFiles = async (drive_id: string, isInitial = true, filtersOverride?: any) => {
    if (isLoading.value || (!isInitial && !hasMore.value)) return

    isLoading.value = true
    error.value = null

    const query = filtersOverride || useRoute().query

    try {
      const res = await driveService.fetchFiles(drive_id, {
        cursor: isInitial ? undefined : (cursor.value ?? undefined),
        limit: 20,
        order_by: query.order_by,
        modified_at: query.modified_at,
        types: query.types
      })

      if (res?.data?.data) {
        const fetched = Array.isArray(res.data.data) ? res.data.data : [res.data.data]
        files.value = isInitial ? fetched : [...files.value, ...fetched]
      }

      cursor.value = res?.data?.cursor ?? null
      hasMore.value = res?.data?.has_more ?? false
    } catch (err) {
      error.value = 'Failed to fetch file'
      console.error('File fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    drives,
    hasMore,
    files,
    isLoading,
    error,
    fetchFiles,
    fetchDrives
  }
})
