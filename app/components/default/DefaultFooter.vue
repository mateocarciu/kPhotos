<template>
  <footer class="mt-auto border-t border-neutral-200 dark:border-neutral-800">
    <CommonScrollToTop />
    <UContainer class="space-between flex h-14 items-center">
      <span class="text-sm text-neutral-500"> © {{ new Date().getFullYear() }} kPhotos.</span>
      <UButton class="ml-auto" color="neutral" variant="ghost" size="md" label="View on GitHub" icon="i-simple-icons-github" to="https://github.com/mateocarciu/kPhotos" target="_blank" />
    </UContainer>
  </footer>
</template>
