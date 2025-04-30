<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'sm:max-w-7xl' }" :title="file.name" :description="`File ${file.extension_type.toUpperCase()}`" @close="emit('close', false)">
    <template #body>
      <div class="flex flex-col items-center gap-6 bg-transparent p-4">
        <div class="relative w-full rounded-xl">
          <NuxtImg v-if="imageUrl" :src="imageUrl" :alt="file.name" class="max-h-[calc(80vh-150px)] w-full object-contain opacity-0 transition-opacity duration-500" @load="onImageLoad" />

          <div v-if="loading" class="absolute inset-0 flex animate-pulse items-center justify-center">
            <div class="border-t-primary-500 h-16 w-16 animate-spin rounded-full border-4 border-gray-300" />
          </div>
        </div>

        <UButton size="sm" :icon="showDetails ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="mt-4" @click="showDetails = !showDetails">
          {{ showDetails ? 'Hide details' : 'Show details' }}
        </UButton>

        <div v-if="showDetails" class="grid w-full grid-cols-1 gap-4 text-sm text-gray-800 sm:grid-cols-2 dark:text-gray-200">
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Name</span>
            <span class="font-medium">{{ file.name }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Size</span>
            <span class="font-medium">{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">MIME Type</span>
            <span class="font-medium">{{ file.mime_type }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Modified on</span>
            <span class="font-medium">{{ formatDate(file.last_modified_at) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Added on</span>
            <span class="font-medium">{{ formatDate(file.added_at) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Extension</span>
            <span class="font-medium">{{ file.extension_type.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'

const emit = defineEmits<{ close: [boolean] }>()
const props = defineProps<{ file: DriveFile }>()

const isOpen = ref(false)
const loading = ref(true)
const imageUrl = ref('')
const showDetails = ref(false)

watchEffect(() => {
  if (props.file) {
    loading.value = true
    imageUrl.value = getImageUrl(props.file)
    showDetails.value = false
  }
})

function getImageUrl(file: DriveFile) {
  const params = new URLSearchParams({
    drive_id: file.drive_id.toString(),
    file_id: file.id.toString()
  })
  return `/api/drives/files/preview?${params.toString()}`
}

function onImageLoad(e: Event) {
  loading.value = false
  const img = e.target as HTMLImageElement
  img.style.opacity = '1'
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}
</script>
