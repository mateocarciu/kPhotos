<template>
  <div class="my-10">
    <h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Your drive photos</h1>

    <div v-if="isLoading && files.length === 0" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="py-10 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else-if="files.length" class="relative">
      <div v-for="(group, index) in groupedFiles" :key="index" :ref="(el) => sectionRefs.set(group.label, el as HTMLElement)" class="mb-10">
        <div class="sticky top-0 z-10 mb-4 bg-white/80 py-2 text-xl font-semibold text-gray-700 backdrop-blur dark:bg-gray-900/80 dark:text-white">
          {{ group.label }}
        </div>

        <div class="grid grid-cols-3 gap-1 sm:grid-cols-4 md:flex md:flex-wrap">
          <div v-for="file in group.files" :key="file.id" class="relative overflow-hidden rounded-lg md:w-auto">
            <DrivePhotoCard :file="file" :drive-id="drive_id" :loaded="loadedImages.has(file.id)" @loaded="onImageLoad(file.id)" @click="openDetail(file.id)" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="shouldShowEmptyState" class="flex flex-col items-center py-10 text-center text-gray-500">
      <UIcon name="i-heroicons-folder" class="mb-4 h-12 w-12 text-gray-400" />
      <p class="text-lg font-medium">No files found</p>
      <p class="text-sm text-gray-400">Try uploading some files or check back later.</p>
    </div>
    <CommonFilesFilters />
    <div ref="infiniteScrollTrigger" class="h-10" />
    <div v-if="isLoading && files.length > 0" class="flex justify-center py-4">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-6 w-6 animate-spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'
import { useInfiniteScroll } from '@vueuse/core'
import { ModalsUIFilesDetail } from '#components'

useHead({ title: 'Your drive photos' })

const { files, isLoading, error, fetchFiles, hasMore } = useDrive()
const route = useRoute()
const drive_id = route.params.id as string
const sectionRefs = ref(new Map<string, HTMLElement>())
const infiniteScrollTrigger = ref<HTMLElement | null>(null)
const hasInitiallyLoaded = ref(false)

const loadedImages = ref<Set<number>>(new Set())
function onImageLoad(fileId: number) {
  loadedImages.value.add(fileId)
}

const shouldShowEmptyState = computed(() => {
  return hasInitiallyLoaded.value && !isLoading.value && !error.value && files.value.length === 0
})

const groupedFiles = computed(() => {
  const groups: Record<string, DriveFile[]> = {}
  for (const file of files.value) {
    const date = new Date(file.last_modified_at * 1000)
    const label = date.toLocaleDateString('en-EN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    if (!groups[label]) groups[label] = []
    groups[label].push(file)
  }
  return Object.entries(groups).map(([label, files]) => ({ label, files }))
})

function openDetail(fileId: number) {
  const overlay = useOverlay()
  const modal = overlay.create(ModalsUIFilesDetail, { props: { fileId } })
  modal.open()
}

useInfiniteScroll(
  infiniteScrollTrigger,
  () => {
    if (hasMore.value && !isLoading.value) {
      fetchFiles(drive_id, false)
    }
  },
  {
    distance: 300,
    canLoadMore: () => hasMore.value
  }
)

onMounted(async () => {
  await fetchFiles(drive_id)

  if (files.value.length > 0) {
    hasInitiallyLoaded.value = true
  } else {
    // attendre pour éviter le flash "No files found"
    setTimeout(() => {
      hasInitiallyLoaded.value = true
    }, 300)
  }
})
</script>
