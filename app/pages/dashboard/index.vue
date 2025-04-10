<template>
    <div>
        <div class="my-8">
            <h1 class="text-2xl font-bold mb-4">My Files</h1>
            <div v-if="isLoading" class="flex justify-center">
                <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin" />
            </div>

            <div v-else-if="error" class="text-red-500">
                {{ error }}
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <UCard v-for="file in files" :key="file.id" class="cursor-pointer hover:shadow-lg transition-shadow"
                    @click="handleFileClick(file)">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon :name="file.type === 'dir' ? 'i-heroicons-folder' : 'i-heroicons-document'"
                                class="h-5 w-5" />
                            <span class="font-medium truncate">{{ file.name }}</span>
                        </div>
                    </template>

                    <div class="text-sm text-gray-500">
                        <div v-if="file.type === 'dir'">
                            <div>Created at: {{ formatDate(file.added_at) }}</div>
                        </div>
                        <div v-else>
                            <img :src="file.path" />
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DriveFile } from '~/types'


const { files, isLoading, error, fetchFiles } = useDrive()

fetchFiles()

const handleFileClick = (file: DriveFile) => {
    if (file.type === 'dir') {
        // TODO: Implémenter la navigation dans les dossiers 
    } else {
        // TODO: Implémenter l'ouverture des fichiers / png /jpeg / mp4 etc
        console.log('Opening file:', file)
    }
}

const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>