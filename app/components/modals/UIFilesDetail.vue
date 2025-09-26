<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'sm:max-w-7xl max-h-[95vh] h-full flex flex-col' }" :title="file?.name" :description="`${file?.extension_type?.toUpperCase()}`" @close="emit('close', false)">
    <template #body>
      <div class="flex h-full w-full flex-col items-center justify-center bg-transparent">
        <div class="relative flex h-full w-full items-center justify-center overflow-hidden">
          <UButton color="neutral" variant="solid" icon="i-heroicons-chevron-left" class="absolute top-1/2 left-2 z-10 -translate-y-1/2" :disabled="!hasPrevious" @click="navigateToPrevious" />

          <div v-if="fileUrl && file?.extension_type === 'image'" ref="imageContainer" class="flex h-full w-full cursor-grab items-center justify-center overflow-hidden" :class="{ 'cursor-grabbing': isDragging }" @wheel.prevent="handleWheel" @mousedown="startDrag" @mousemove="handleDrag" @mouseup="endDrag" @mouseleave="endDrag" @dblclick="handleDoubleClick">
            <NuxtImg
              ref="zoomableImage"
              :src="fileUrl"
              :alt="file?.name"
              class="pointer-events-none max-h-full max-w-full rounded-xl object-contain opacity-0 transition-opacity duration-500 select-none"
              :style="{
                transform: zoomLevel !== 1 || panX !== 0 || panY !== 0 ? `scale(${zoomLevel}) translate(${panX}px, ${panY}px)` : 'none',
                transformOrigin: 'center center',
                willChange: zoomLevel !== 1 ? 'transform' : 'auto',
                backfaceVisibility: 'hidden',
                imageRendering: 'high-quality'
              }"
              @load="onImageLoad" />
          </div>

          <video v-if="fileUrl && file?.extension_type === 'video'" :src="fileUrl" controls controlsList="nodownload" class="max-h-full max-w-full rounded-xl object-contain" />

          <UButton color="neutral" variant="solid" icon="i-heroicons-chevron-right" class="absolute top-1/2 right-2 z-10 -translate-y-1/2" @click="navigateToNext" />

          <div v-if="file?.extension_type === 'image'" class="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <UButton color="neutral" variant="solid" icon="i-heroicons-plus" size="sm" @click="zoomIn" />
            <UButton color="neutral" variant="solid" icon="i-heroicons-minus" size="sm" @click="zoomOut" />
            <UButton color="neutral" variant="solid" icon="i-heroicons-arrow-path" size="sm" @click="resetZoom" />
          </div>

          <UBadge v-if="file?.extension_type === 'image' && zoomLevel !== 1" class="absolute right-4 bottom-4 z-20 px-3 py-1 text-sm" color="primary" variant="solid"> {{ Math.round(zoomLevel * 100) }}% </UBadge>

          <div v-if="loading && file?.extension_type === 'image'" class="absolute inset-0 flex items-center justify-center">
            <div class="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-(--ui-primary)" />
          </div>
        </div>

        <div class="mt-4 flex gap-4">
          <UButton :icon="showDetails ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" @click="showDetails = !showDetails">
            {{ showDetails ? 'Hide details' : 'Show details' }}
          </UButton>
          <UButton icon="i-heroicons-arrow-down-tray" color="primary" variant="solid" :disabled="!file" @click="downloadFile"> Download </UButton>
        </div>

        <div v-if="showDetails" class="mt-2 w-full rounded-2xl border border-gray-200 bg-white/60 p-6 dark:border-gray-800 dark:bg-gray-800/40">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">File Information</h3>

          <div class="grid grid-cols-1 gap-6 text-sm text-gray-800 sm:grid-cols-2 lg:grid-cols-3 dark:text-gray-200">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Name</span>
              <span class="truncate font-medium text-gray-900 dark:text-gray-100">{{ file?.name }}</span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Size</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ file?.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : '0.00 MB' }}</span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">MIME Type</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ file?.mime_type }}</span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Modified on</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatDate(file?.last_modified_at ?? 0) }}</span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Added on</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatDate(file?.added_at ?? 0) }}</span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Extension</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ file?.extension_type.toUpperCase() }}</span>
            </div>
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
const props = defineProps<{ fileId: number }>()
const currentIndex = ref(-1)
const toast = useToast()
const currentFileId = ref(props.fileId)
const hasPrevious = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < files.value.length - 1)
const isOpen = ref(false)
const loading = ref(true)
const fileUrl = ref('')
const showDetails = ref(false)

// Simple zoom functionality
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const lastMouseX = ref(0)
const lastMouseY = ref(0)
const imageContainer = ref<HTMLElement>()

const emit = defineEmits<{
  close: [boolean]
}>()

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

watchEffect(() => {
  if (file.value) {
    isOpen.value = true
    loading.value = true
    fileUrl.value = file.value.extension_type === 'image' ? buildFileUrl(file.value, 'preview') : buildFileUrl(file.value, 'download')
    showDetails.value = false
    // Reset zoom when switching files
    zoomLevel.value = 1
    panX.value = 0
    panY.value = 0
  }
})

function buildFileUrl(file: DriveFile, type: 'preview' | 'download') {
  const params = new URLSearchParams({
    drive_id: file.drive_id.toString(),
    file_id: file.id.toString()
  })
  return `/api/drives/files/${type}?${params.toString()}`
}

function downloadFile() {
  if (!file.value) return

  const downloadUrl = buildFileUrl(file.value, 'download')

  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = file.value.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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

function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.3, 5)
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.3, 0.5)
}

function resetZoom() {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

function handleWheel(event: WheelEvent) {
  if (file.value?.extension_type !== 'image') return
  event.preventDefault()

  const delta = event.deltaY > 0 ? -0.2 : 0.2
  zoomLevel.value = Math.min(Math.max(zoomLevel.value + delta, 0.5), 5)
}

function startDrag(event: MouseEvent) {
  if (file.value?.extension_type !== 'image' || zoomLevel.value <= 1) return
  isDragging.value = true
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
}

function handleDrag(event: MouseEvent) {
  if (!isDragging.value) return

  const deltaX = event.clientX - lastMouseX.value
  const deltaY = event.clientY - lastMouseY.value

  panX.value += deltaX / zoomLevel.value
  panY.value += deltaY / zoomLevel.value

  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
}

function endDrag() {
  isDragging.value = false
}

function handleDoubleClick() {
  if (file.value?.extension_type !== 'image') return

  if (zoomLevel.value === 1) {
    zoomLevel.value = 2.5
  } else {
    resetZoom()
  }
}
</script>
