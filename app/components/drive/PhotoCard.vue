<template>
  <div class="relative overflow-hidden rounded-lg">
    <div class="group relative cursor-pointer">
      <div v-if="!loaded" class="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-gray-400" />
      </div>

      <NuxtImg :src="`/api/drives/files/thumbnail?drive_id=${driveId}&file_id=${file.id}&width=400&height=400`" :alt="file.name" class="aspect-square w-full object-cover transition-opacity duration-300 md:aspect-auto md:h-60 md:max-w-full" :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }" @load="$emit('loaded', file.id)" />

      <div class="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%)" />

      <div class="absolute top-2 right-2 z-30 flex flex-col items-end space-y-1 p-1">
        <UIcon v-if="file.extension_type === 'video'" name="i-heroicons-play-circle" class="h-5 w-5 text-white drop-shadow" />
        <UIcon v-if="file.is_favorite" name="i-heroicons-star-solid" class="h-5 w-5 text-yellow-400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'

defineProps<{
  file: DriveFile
  driveId: string
  loaded: boolean
}>()

defineEmits<{
  (e: 'loaded', id: number): void
}>()
</script>
