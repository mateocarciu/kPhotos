export const useDrive = () => {
  const store = useDriveStore()
  return {
    drives: computed(() => store.drives),
    files: computed(() => store.files),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    hasMore: computed(() => store.hasMore),
    fetchDrives: store.fetchDrives,
    fetchFiles: store.fetchFiles
  }
}
