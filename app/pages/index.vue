<template>
  <div>
    <div class="my-24 grid max-w-7xl gap-16 sm:grid-cols-2 sm:gap-y-24 lg:items-center">
      <div>
        <h1 class="mb-5 max-w-sm text-5xl font-bold lg:text-6xl lg:tracking-tight">Welcome to kPhotos</h1>
        <p class="max-w-sm text-xl text-neutral-400">kPhotos is an Google Photos alternative</p>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <UButton label="Home" variant="solid" color="primary" to="/dashboard" />
          <UButton label="Learn more" variant="outline" color="neutral" to="https://github.com/mateocarciu/kPhotos"
            taget="_blank" />
        </div>
      </div>
    </div>
  </div>
</template>