import type { Drive, DriveFile } from '~/types'
import { useApiFetch } from '~/utils/useApiFetch'

export const useDriveStore = defineStore('drive', () => {
  const drives = ref<Drive[]>([])
  const files = ref<DriveFile[]>([])
  const folders = ref<DriveFile[]>([])
  const cursor = ref<string | null>(null)
  const hasMore = ref(true)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchDrives = async () => {
    isLoading.value = true
    error.value = null

    try {
      const res = await useApiFetch<{ data: Drive[] }>('/api/drives')
      if (res?.data?.data && Array.isArray(res.data.data)) {
        drives.value = Array.isArray(res?.data?.data) ? (res.data.data as Drive[]) : []
      }
    } catch (err) {
      error.value = 'Failed to fetch files'
      console.error('Drive fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchFiles = async (drive_id: string, isInitial = true, filtersOverride?: any) => {
    if (isLoading.value || (!isInitial && !hasMore.value)) return

    if (isInitial) {
      files.value = []
      cursor.value = null
      hasMore.value = true
    }

    isLoading.value = true
    error.value = null

    const query = filtersOverride || useRoute().query

    try {
      const res = await useApiFetch<{ data: DriveFile[]; cursor?: string; has_more?: boolean }>('/api/drives/files', {
        params: {
          drive_id,
          cursor: isInitial ? undefined : (cursor.value ?? undefined),
          limit: 20,
          order_by: query?.order_by,
          modified_at: query?.modified_at,
          modified_after: query?.modified_after,
          modified_before: query?.modified_before,
          order_dir: query?.order_dir,
          types: query?.types,
          directory_id: query?.directory_id
        }
      })

      if (res?.data?.data) {
        const fetched = Array.isArray(res.data.data) ? res.data.data : [res.data.data]
        const existingIds = new Set(files.value.map((f) => f.id))
        const newFiles = fetched.filter((f) => !existingIds.has(f.id))
        files.value = isInitial ? fetched : [...files.value, ...newFiles]
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

  const fetchFolders = async (drive_id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await useApiFetch<{ data: DriveFile[] }>('/api/drives/folders', {
        params: {
          drive_id
        }
      })
      if (res?.data?.data) {
        const fetched = Array.isArray(res.data.data) ? res.data.data : [res.data.data]
        folders.value = fetched
      }
    } catch (err) {
      error.value = 'Failed to fetch folders'
      console.error('Folder fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    drives,
    hasMore,
    files,
    folders,
    isLoading,
    error,
    fetchFolders,
    fetchFiles,
    fetchDrives
  }
})
