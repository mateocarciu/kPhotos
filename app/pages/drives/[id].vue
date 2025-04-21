<template>
  <div class="my-10">
    <h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Your drive photos</h1>

    <UBadge v-if="floatingDate" class="fixed top-4 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow backdrop-blur dark:bg-gray-900/80 dark:text-white" :label="floatingDate" />

    <div v-if="isLoading && files.length === 0" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="py-10 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <div v-for="(group, index) in groupedFiles" :key="index" class="mb-10">
        <div :ref="(el) => sectionRefs.set(group.label, el as HTMLElement)" class="mb-4 text-xl font-semibold text-gray-700 dark:text-white">
          {{ group.label }}
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <div v-for="file in group.files" :key="file.id" class="relative overflow-hidden rounded-lg">
            <DrivePhotoCard :file="file" :drive-id="drive_id" :loaded="loadedImages.has(file.id)" @loaded="onImageLoad(file.id)" />
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

useHead({ title: 'Your drive photos' })

const { files, isLoading, error, fetchFiles, hasMore } = useDrive()
const route = useRoute()
const drive_id = route.params.id as string

const loadedImages = ref<Set<number>>(new Set())
function onImageLoad(fileId: number) {
  loadedImages.value.add(fileId)
}

const sectionRefs = ref(new Map<string, HTMLElement>())
const floatingDate = ref('')

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

const infiniteScrollTrigger = ref<HTMLElement | null>(null)

const onIntersect = () => {
  if (hasMore.value && !isLoading.value) {
    fetchFiles(drive_id, false)
    sectionRefs.value.clear()
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

  window.addEventListener('scroll', updateFloatingDate, { passive: true })
  updateFloatingDate()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateFloatingDate)
  sectionRefs.value.clear()
})

function updateFloatingDate() {
  const sections = Array.from(sectionRefs.value.entries())
  let found = false

  for (const [label, el] of sections) {
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top < 100 && rect.bottom > 100) {
      floatingDate.value = label
      found = true
      break
    }
  }

  if (!found && window.scrollY <= 10) {
    floatingDate.value = ''
  }
}
</script>
