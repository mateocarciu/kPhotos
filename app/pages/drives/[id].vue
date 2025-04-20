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
          <div v-for="file in group.files" :key="file.id" class="relative overflow-hidden rounded-lg shadow">
            <div class="group relative cursor-pointer">
              <div v-if="!loadedImages[file.id]" class="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-gray-400" />
              </div>

              <NuxtImg :src="`/api/drives/thumbnail?drive_id=${drive_id}&file_id=${file.id}&width=400&height=400`" :alt="file.name" class="h-64 w-full object-contain transition-opacity duration-300" :class="{ 'opacity-0': !loadedImages[file.id], 'opacity-100': loadedImages[file.id] }" @load="onImageLoad(file.id)" />

              <div class="absolute bottom-0 w-full truncate bg-black/50 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {{ file.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="infiniteScrollTrigger" class="h-10" />
    <div v-if="isLoading && files.length > 0" class="flex justify-center py-4">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-6 w-6 animate-spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'

const { files, isLoading, error, fetchFiles, hasMore } = useDrive()
const route = useRoute()
const drive_id = route.params.id as string

const loadedImages = ref<Record<number, boolean>>({})
function onImageLoad(fileId: number) {
  loadedImages.value[fileId] = true
}
const infiniteScrollTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// Date flottante
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

const onIntersect = (entries: IntersectionObserverEntry[]) => {
  const [entry] = entries
  if (entry?.isIntersecting && hasMore.value && !isLoading.value) {
    fetchFiles(drive_id, false)
    sectionRefs.value.clear()
  }
}

const updateFloatingDate = () => {
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

onMounted(async () => {
  await fetchFiles(drive_id)
  await nextTick()

  observer.value = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: '300px',
    threshold: 0.1
  })

  if (infiniteScrollTrigger.value) {
    observer.value.observe(infiniteScrollTrigger.value)
  }

  window.addEventListener('scroll', updateFloatingDate, { passive: true })
  updateFloatingDate()
})

onUnmounted(() => {
  if (observer.value && infiniteScrollTrigger.value) {
    observer.value.unobserve(infiniteScrollTrigger.value)
  }
  window.removeEventListener('scroll', updateFloatingDate)
  sectionRefs.value.clear()
})
</script>
