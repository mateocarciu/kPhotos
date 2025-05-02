<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'sm:max-w-7xl' }" :title="file?.name" :description="`File ${file?.extension_type?.toUpperCase()}`" @close="emit('close', false)">
    <template #body>
      <div class="flex flex-col items-center gap-6 bg-transparent">
        <div class="relative flex w-full items-center justify-center rounded-xl" style="min-height: 60vh">
          <UButton color="neutral" variant="solid" icon="i-heroicons-chevron-left" class="absolute top-1/2 left-2 z-10 -translate-y-1/2" :disabled="!hasPrevious" @click="navigateToPrevious" />

          <NuxtImg v-if="imageUrl" ref="imageRef" :src="imageUrl" :alt="file?.name" class="max-h-[calc(80vh-150px)] rounded-xl opacity-0 transition-opacity duration-500" @load="onImageLoad" />

          <UButton color="neutral" variant="solid" icon="i-heroicons-chevron-right" class="absolute top-1/2 right-2 z-10 -translate-y-1/2" :disabled="!hasNext && !hasMore" @click="navigateToNext" />

          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-(--ui-primary)" />
          </div>
        </div>

        <div class="w-full text-center">
          <UButton :icon="showDetails ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" @click="showDetails = !showDetails">
            {{ showDetails ? 'Hide details' : 'Show details' }}
          </UButton>
        </div>

        <div v-if="showDetails" class="grid w-full grid-cols-1 gap-4 text-sm text-gray-800 dark:text-gray-200">
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Name</span>
            <span class="font-medium">{{ file?.name }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Size</span>
            <span class="font-medium">{{ file?.size ? (file.size / (1024 * 1024)).toFixed(2) : '0.00' }} MB</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">MIME Type</span>
            <span class="font-medium">{{ file?.mime_type }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Modified on</span>
            <span class="font-medium">{{ formatDate(file?.last_modified_at ?? 0) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Added on</span>
            <span class="font-medium">{{ formatDate(file?.added_at ?? 0) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400">Extension</span>
            <span class="font-medium">{{ file?.extension_type.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'
import { formatDate } from '#imports'

const route = useRoute()
const drive_id = route.params.id as string
const { files, isLoading, fetchFiles, hasMore } = useDrive()

const emit = defineEmits<{
  close: [boolean]
}>()

const props = defineProps<{ fileId: number }>()

const currentIndex = ref(-1)
const toast = useToast()
const currentFileId = ref(props.fileId)

watchEffect(() => {
  currentFileId.value = props.fileId
})

const file = computed(() => {
  const index = files.value.findIndex((f) => f.id === currentFileId.value)
  return index !== -1 ? files.value[index] : null
})

watchEffect(() => {
  const index = files.value.findIndex((f) => f.id === currentFileId.value)
  if (index !== -1) {
    currentIndex.value = index
  }
})

const hasPrevious = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < files.value.length - 1)

const isOpen = ref(false)
const loading = ref(true)
const imageUrl = ref('')
const showDetails = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

watchEffect(() => {
  if (file.value) {
    isOpen.value = true
    loading.value = true
    imageUrl.value = getImageUrl(file.value)
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

async function navigateToPrevious() {
  if (hasPrevious.value) {
    const previousFile = files.value[currentIndex.value - 1]
    if (previousFile) {
      currentFileId.value = previousFile.id
    }
  }
}

async function navigateToNext() {
  if (hasNext.value) {
    const nextFile = files.value[currentIndex.value + 1]
    if (nextFile) {
      currentFileId.value = nextFile.id
    }
  } else if (hasMore.value && !isLoading.value) {
    try {
      loading.value = true
      await fetchFiles(drive_id, false)

      if (files.value.length > currentIndex.value + 1) {
        const nextFile = files.value[currentIndex.value + 1]
        if (nextFile) {
          currentFileId.value = nextFile.id
        }
      } else {
        toast.add({ title: 'No more files available', color: 'info' })
      }
    } catch (err) {
      toast.add({ title: 'Failed to load more files', color: 'error' })
      console.error('Failed to load more files:', err)
    } finally {
      loading.value = false
    }
  }
}
</script>
