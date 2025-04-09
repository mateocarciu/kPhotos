import type { DriveFile } from '~/types'
import * as driveService from '~/services/driveService'

export const useDriveStore = defineStore('drive', {
  state: () => ({
    files: [] as DriveFile[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getFiles: (state) => state.files
  },

  actions: {
    async fetchFiles() {
      this.isLoading = true
      this.error = null

      try {
        const res = await driveService.fetchFiles()
        this.files = res?.data?.data as unknown as DriveFile[]
      } catch (err) {
        this.error = 'Failed to fetch files'
        console.error('Drive fetch error:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
})
