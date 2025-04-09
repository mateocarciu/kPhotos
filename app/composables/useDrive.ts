export const useDrive = () => {
  const store = useDriveStore()
  return {
    files: computed(() => store.getFiles),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    fetchFiles: store.fetchFiles
  }
}
