<template>
  <header class="bg-background/75 border-b border-neutral-200 dark:border-neutral-800">
    <UContainer class="flex h-14 items-center justify-between">
      <NuxtLink to="/">kPhotos</NuxtLink>
      <div class="flex gap-2">
        <ColorModeButton />
        <NavbarProfile />
      </div>
    </UContainer>
  </header>
</template>
