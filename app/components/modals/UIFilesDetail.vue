<template>
  <UModal v-model:open="isOpen" :title="file.name" :description="`Fichier ${file.extension_type.toUpperCase()}`" @close="emit('close', false)">
    <template #body>
      <div class="flex flex-col items-center space-y-4 p-4">
        <NuxtImg :src="`/api/drives/files/thumbnail?drive_id=${file.drive_id}&file_id=${file.id}&width=400&height=400`" :alt="file.name" class="w-full object-contain transition-opacity duration-300" />

        <div class="w-full space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div><strong>Name:</strong> {{ file.name }}</div>
          <div><strong>Size:</strong> {{ (file.size / (1024 * 1024)).toFixed(2) }} MB</div>
          <div><strong>Type:</strong> {{ file.mime_type }}</div>
          <div><strong>Last Modified:</strong> {{ new Date(file.last_modified_at * 1000).toLocaleString() }}</div>
          <div><strong>Added On:</strong> {{ new Date(file.added_at * 1000).toLocaleString() }}</div>
          <div><strong>Extension:</strong> {{ file.extension_type }}</div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'
const emit = defineEmits<{ close: [boolean] }>()

defineProps<{
  file: DriveFile
}>()

const isOpen = ref(false)
</script>
