<template>
  <div class="relative overflow-hidden rounded-lg">
    <div class="group relative cursor-pointer">
      <div v-if="!loaded" class="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-gray-400" />
      </div>

      <NuxtImg :src="`/api/drives/files/thumbnail?drive_id=${driveId}&file_id=${file.id}&width=400&height=400`" :alt="file.name" class="h-64 w-full transition-opacity duration-300" :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }" @load="$emit('loaded', file.id)" />

      <div v-if="file.extension_type === 'video'" class="absolute top-2 right-2 z-20 p-1">
        <UIcon name="i-heroicons-play-circle" class="h-6 w-6 text-white" />
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
