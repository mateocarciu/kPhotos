export const useDrive = () => {
  const store = useDriveStore()
  return {
    drives: computed(() => store.getDrives),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    fetchDrives: store.fetchDrives
  }
}
