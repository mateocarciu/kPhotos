<template>
  <UApp>
    <div class="flex min-h-screen flex-col bg-white dark:bg-neutral-900">
      <DefaultNavbar />
      <UContainer class="w-full">
        <NuxtPage />
      </UContainer>
      <CommonScrollToTop />
      <DefaultFooter />
    </div>
  </UApp>
</template>
