<template>
  <div class="my-10">
    <h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Drive Content</h1>

    <UBadge v-if="floatingDate" class="fixed top-4 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow backdrop-blur dark:bg-gray-900/80 dark:text-white" :label="floatingDate" />

    <div v-if="isLoading && files.length === 0" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="text-primary h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="py-10 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <div v-for="(group, index) in groupedFiles" :key="index" class="mb-10">
        <div :ref="(el) => sectionRefs.set(group.label, el)" class="mb-4 text-xl font-semibold text-gray-700 dark:text-white">
          {{ group.label }}
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <template v-for="file in group.files" :key="file.id">
            <div v-if="file.extension_type === 'image' || file.extension_type === 'video'" class="group relative cursor-pointer overflow-hidden rounded-lg shadow transition hover:shadow-lg" @click="handleItemClick(file)">
              <img :src="getThumbnailUrl(file.id)" alt="thumbnail" class="h-64 w-full rounded-lg object-cover" />
              <div class="absolute bottom-0 w-full truncate bg-black/50 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {{ file.name }}
              </div>
            </div>

            <UCard v-else class="transition-shadow hover:shadow-lg">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-folder" class="h-5 w-5 text-yellow-500" />
                  <span class="truncate font-medium">{{ file.name }}</span>
                </div>
              </template>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">Dossier</div>
              <div class="mt-2 text-xs text-gray-400">Modifié : {{ formatDate(file.last_modified_at) }}</div>
              <template #footer>
                <div class="flex justify-end">
                  <UButton trailing-icon="i-heroicons-arrow-right" variant="solid"> Open </UButton>
                </div>
              </template>
            </UCard>
          </template>
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
import { formatDate } from '#imports'

const { files, isLoading, error, fetchFiles, hasMore } = useDrive()

const route = useRoute()
const router = useRouter()

const drive_id = route.params.id as string
const infiniteScrollTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// date flottante
const sectionRefs = new Map<string, HTMLElement>()
const floatingDate = ref('')

// Regroupement des fichiers par date
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

// 🎯 IntersectionObserver pour scroll infini
const onIntersect = (entries: IntersectionObserverEntry[]) => {
  const [entry] = entries
  if (entry && entry.isIntersecting && hasMore.value && !isLoading.value) {
    fetchFiles(drive_id, false)
  }
}

// 📡 Date flottante liée à la section visible
const updateFloatingDate = () => {
  const sections = Array.from(sectionRefs.entries())
  let found = false

  for (const [label, el] of sections) {
    const rect = el.getBoundingClientRect()
    if (rect.top < 100 && rect.bottom > 100) {
      floatingDate.value = label
      found = true
      break
    }
  }

  // Disparition du floating date si on est en haut de la page
  if (!found && window.scrollY <= 10) {
    floatingDate.value = ''
  }
}

onMounted(() => {
  fetchFiles(drive_id)

  observer.value = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: '300px',
    threshold: 0.1
  })

  if (infiniteScrollTrigger.value) {
    observer.value.observe(infiniteScrollTrigger.value)
  }

  window.addEventListener('scroll', updateFloatingDate, { passive: true })
})

onUnmounted(() => {
  if (observer.value && infiniteScrollTrigger.value) {
    observer.value.unobserve(infiniteScrollTrigger.value)
  }

  window.removeEventListener('scroll', updateFloatingDate)
})

// fetch thumbnail
const getThumbnailUrl = (file_id: number) => {
  return `/api/drives/thumbnail?drive_id=${drive_id}&file_id=${file_id}`
}
</script>
