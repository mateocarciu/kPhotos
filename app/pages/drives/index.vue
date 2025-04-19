<template>
  <div class="my-10">
    <h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">My Drives</h1>

    <div v-if="isLoading" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="py-10 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <UCard v-for="drive in drives" :key="drive.id" class="transition-shadow hover:shadow-lg">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-folder" class="h-6 w-6 text-yellow-500" />
              <span class="truncate font-semibold">{{ drive.name }}</span>
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
            <span> {{ formatDriveSize(drive.used_size) }} / {{ formatDriveSize(drive.size) }} </span>
          </div>

          <UProgress v-model="drive.used_size" :max="drive.size" color="primary" size="sm" status class="rounded-full" />

          <div class="text-xs text-gray-500 dark:text-gray-400">Created: {{ formatDate(drive.created_at) }}</div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton trailing-icon="i-heroicons-arrow-right" variant="solid" @click="handleDriveClick(drive.id)"> Open </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '#imports'

const { drives, isLoading, error, fetchDrives } = useDrive()

onMounted(fetchDrives)

const handleDriveClick = (drive_id: number) => {
  navigateTo(`drives/${drive_id}`)
}

const formatDriveSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
