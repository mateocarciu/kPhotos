import type { Drive } from '~/types'
import * as driveService from '~/services/driveService'

export const useDriveStore = defineStore('drive', {
  state: () => ({
    drives: [] as Drive[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getDrives: (state) => state.drives
  },

  actions: {
    async fetchDrives() {
      this.isLoading = true
      this.error = null

      try {
        const res = await driveService.fetchDrives()
        this.drives = res?.data?.data as unknown as Drive[]
      } catch (err) {
        this.error = 'Failed to fetch files'
        console.error('Drive fetch error:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
})
