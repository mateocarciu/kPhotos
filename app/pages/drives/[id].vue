<template>
  <div class="my-10">
    <h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Your drive photos</h1>

    <div v-if="isLoading && files.length === 0" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="py-10 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else class="relative">
      <div v-for="(group, index) in groupedFiles" :key="index" :ref="(el) => sectionRefs.set(group.label, el as HTMLElement)" class="mb-10">
        <div class="sticky top-0 z-10 mb-4 bg-white/80 px-4 py-2 text-xl font-semibold text-gray-700 backdrop-blur dark:bg-gray-900/80 dark:text-white">
          {{ group.label }}
        </div>

        <div class="flex flex-wrap gap-1">
          <div v-for="file in group.files" :key="file.id" class="relative overflow-hidden rounded-lg">
            <DrivePhotoCard :file="file" :drive-id="drive_id" :loaded="loadedImages.has(file.id)" @loaded="onImageLoad(file.id)" @click="openDetail(file)" />
          </div>
        </div>
      </div>
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
import { useIntersectionObserver } from '@vueuse/core'
import { ModalsUIFilesDetail } from '#components'

useHead({ title: 'Your drive photos' })

const { files, isLoading, error, fetchFiles, hasMore } = useDrive()
const route = useRoute()
const drive_id = route.params.id as string
const sectionRefs = ref(new Map<string, HTMLElement>())
const infiniteScrollTrigger = ref<HTMLElement | null>(null)

const loadedImages = ref<Set<number>>(new Set())
function onImageLoad(fileId: number) {
  loadedImages.value.add(fileId)
}

const groupedFiles = computed(() => {
  const groups: Record<string, DriveFile[]> = {}
  for (const file of files.value) {
    const date = new Date(file.last_modified_at * 1000)
    const label = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    if (!groups[label]) groups[label] = []
    groups[label].push(file)
  }
  return Object.entries(groups).map(([label, files]) => ({ label, files }))
})

function openDetail(file: DriveFile) {
  const overlay = useOverlay()
  const modal = overlay.create(ModalsUIFilesDetail, { props: { file: file } })
  modal.open()
}

const onIntersect = () => {
  if (hasMore.value && !isLoading.value) {
    fetchFiles(drive_id, false)
  }
}

onMounted(async () => {
  await fetchFiles(drive_id)
  await nextTick()

  if (infiniteScrollTrigger.value) {
    useIntersectionObserver(
      infiniteScrollTrigger,
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) onIntersect()
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0.1
      }
    )
  }
})
</script>
