<template>
  <UFooter class="border-t border-neutral-200 dark:border-neutral-800">
    <CommonScrollToTop />
    <template #left>
      <p class="text-muted text-sm">
        <span class="text-sm text-neutral-500"> © {{ new Date().getFullYear() }} kPhotos.</span>
      </p>
    </template>
    <template #right>
      <UButton class="ml-auto" color="neutral" variant="ghost" size="md" label="View on GitHub" icon="i-simple-icons-github" to="https://github.com/mateocarciu/kPhotos" target="_blank" aria-label="GitHub" />
    </template>
  </UFooter>
</template>
