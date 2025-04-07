export const useDrive = () => {
  const driveStore = useDriveStore()

  return {
    files: computed(() => driveStore.getFiles),
    isLoading: computed(() => driveStore.isLoading),
    error: computed(() => driveStore.error),
    fetchFiles: driveStore.fetchFiles
  }
}
