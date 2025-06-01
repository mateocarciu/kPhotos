export const useDrive = () => {
  const store = useDriveStore()
  return {
    drives: computed(() => store.drives),
    folders: computed(() => store.folders),
    files: computed(() => store.files),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    hasMore: computed(() => store.hasMore),
    fetchDrives: store.fetchDrives,
    fetchFiles: store.fetchFiles,
    fetchFolders: store.fetchFolders
  }
}
