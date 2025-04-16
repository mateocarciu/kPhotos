<template>
    <div class="my-10">
        <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Drive Content</h1>

        <div v-if="isLoading" class="flex justify-center py-10">
            <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-10">
            {{ error }}
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <UCard v-for="file in files" :key="file.id" class="hover:shadow-lg transition-shadow cursor-pointer"
                @click="handleItemClick(file)">
                <template #header>
                    <div class="flex items-center gap-2">
                        <UIcon :name="file.type === 'dir' ? 'i-heroicons-folder' : 'i-heroicons-document'"
                            class="h-5 w-5" :class="file.type === 'dir' ? 'text-yellow-500' : 'text-blue-500'" />
                        <span class="font-medium truncate">{{ file.name }}</span>
                    </div>
                </template>

                <div v-if="file.type === 'file'" class="mt-2">
                    <img v-if="file.extension_type === 'image'" :src="getThumbnailUrl(file.id)" alt="thumbnail"
                        class="rounded-lg object-cover h-32 w-full" />
                    <div v-else class="text-sm text-gray-500 dark:text-gray-400">
                        Type: {{ file.mime_type }}
                    </div>
                </div>

                <div class="text-xs text-gray-400 mt-2">
                    Modified at: {{ formatDate(file.last_modified_at) }}
                </div>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const drive_id = route.params.id as string
const file_id = route.params.file_id as string

const { files, isLoading, error, fetchFiles } = useDrive()

onMounted(() => {
    fetchFiles(drive_id, file_id)
})

const handleItemClick = (file: any) => {
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
        minute: '2-digit',
    })
}
</script>