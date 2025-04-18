<template>
  <div class="my-10">
    <h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Drive Content</h1>

    <div v-if="isLoading" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="py-10 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <template v-for="file in files" :key="file.id">
        <!-- 📁 Dossier -->
        <UCard v-if="file.type === 'dir'" class="cursor-pointer transition-shadow hover:shadow-lg" @click="handleItemClick(file)">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-folder" class="h-5 w-5 text-yellow-500" />
              <span class="truncate font-medium">{{ file.name }}</span>
            </div>
          </template>

          <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">Dossier</div>
          <div class="mt-2 text-xs text-gray-400">Modified at: {{ formatDate(file.last_modified_at) }}</div>
        </UCard>

        <!-- 🖼️ Image -->
        <div v-else-if="file.extension_type === 'image' || 'video'" class="group relative cursor-pointer overflow-hidden rounded-lg shadow transition hover:shadow-lg" @click="handleItemClick(file)">
          <img :src="getThumbnailUrl(file.id)" alt="thumbnail" format="webp" quality="75" class="h-64 w-full rounded-lg object-cover" />
          <div class="absolute bottom-0 w-full truncate bg-black/50 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {{ file.name }}
          </div>
        </div>

        <!-- 📄 Autres fichiers -->
        <UCard v-else class="cursor-pointer transition-shadow hover:shadow-lg" @click="handleItemClick(file)">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document" class="h-5 w-5 text-blue-500" />
              <span class="truncate font-medium">{{ file.name }}</span>
            </div>
          </template>

          <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">Type: {{ file.mime_type }}</div>
          <div class="mt-2 text-xs text-gray-400">Modified at: {{ formatDate(file.last_modified_at) }}</div>
        </UCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'

const route = useRoute()
const router = useRouter()

const drive_id = route.params.id as string
const file_id = route.params.file_id as string

const { files, isLoading, error, fetchFiles } = useDrive()

onMounted(() => {
  fetchFiles(drive_id, file_id)
})

const handleItemClick = (file: DriveFile) => {
  if (file.type === 'dir') {
    router.push(`/drives/${drive_id}/files/${file.id}`)
  }
}

const getThumbnailUrl = (file_id: number) => {
  return `/api/drives/thumbnail?drive_id=${drive_id}&file_id=${file_id}`
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
