<template>
    <div class="my-10">
        <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Drives</h1>

        <div v-if="isLoading" class="flex justify-center py-10">
            <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-10">
            {{ error }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" v-else>
            <UCard v-for="drive in drives" :key="drive.id" class="hover:shadow-lg transition-shadow">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-folder" class="h-6 w-6 text-yellow-500" />
                            <span class="font-semibold truncate">{{ drive.name }}</span>
                        </div>

                        <div class="flex gap-1">
                            <UBadge v-if="drive.is_locked" color="error" variant="subtle">🔒 Locked</UBadge>
                            <UBadge v-if="drive.in_maintenance" color="warning" variant="subtle">🛠 Maintenance</UBadge>
                        </div>
                    </div>
                </template>

                <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div class="flex justify-between">
                        <span class="font-medium">Used</span>
                        <span>
                            {{ formatDriveSize(drive.used_size) }} / {{ formatDriveSize(drive.size) }}
                        </span>
                    </div>


                    <UProgress v-model="drive.used_size" :max="drive.size" color="primary" size="sm" status
                        class="rounded-full" />

                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        Created: {{ formatDate(drive.created_at) }}
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end">
                        <UButton icon="i-heroicons-arrow-right" variant="ghost" @click.stop="handleDriveClick(drive)">
                            Open
                        </UButton>
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Drive } from '~/types'

const { drives, isLoading, error, fetchDrives } = useDrive()

onMounted(fetchDrives)

const handleDriveClick = (drive: Drive) => {
    console.log('Drive clicked:', drive)
    // Optionnel : navigateTo(`/drives/${drive.id}`)
}

const formatDriveSize = (bytes: number) => {
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