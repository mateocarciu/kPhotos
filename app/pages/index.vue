<template>
  <div class="grid gap-16 pt-24 sm:grid-cols-2 lg:items-center">
    <div>
      <h1 class="mb-5 text-5xl lg:text-6xl lg:tracking-tight">Welcome to <span class="font-bold">kPhotos</span></h1>
      <p class="text-xl text-neutral-400">kPhotos is an alternative to Google Photos, developed with Nuxt 3 and Vue.js. This application allows you to manage your files, photos, and videos intuitively and securely by accessing the Infomaniak API.</p>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <UButton :label="isLoggedIn ? 'Home' : 'Log in'" variant="solid" color="primary" :to="isLoggedIn ? '/drives' : '/login'" />
        <UButton label="Learn more" variant="outline" color="neutral" to="https://github.com/mateocarciu/kPhotos" taget="_blank" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn } = useUser()
</script>
