import type { DriveFile, DriveResponse, DriveStoreState } from '~/types'

export const useDriveStore = defineStore('drive', {
  state: (): DriveStoreState => ({
    files: [],
    isLoading: false,
    error: null,
    currentPath: '/',
    currentFolder: null
  }),
  
  getters: {
    getFiles: (state) => state.files,
    getCurrentPath: (state) => state.currentPath,
    getCurrentFolder: (state) => state.currentFolder
  },
  
  actions: {
    async fetchFiles() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await $fetch<DriveResponse>('/api/drives')
        this.files = response.data
      } catch (err) {
        console.error('Failed to fetch files:', err)
        this.error = 'Failed to fetch files'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    setCurrentPath(path: string) {
      this.currentPath = path
    },
    
    setCurrentFolder(folder: DriveFile | null) {
      this.currentFolder = folder
    }
  }
})
