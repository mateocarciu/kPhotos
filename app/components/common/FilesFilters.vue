<template>
  <UPopover>
    <UButton icon="i-heroicons-adjustments-horizontal" class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 shadow-xl" size="lg" color="primary" variant="solid" />
    <template #content>
      <div class="fixed bottom-[5rem] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-xl backdrop-blur sm:flex-row dark:border-gray-800 dark:bg-gray-900">
        <USelectMenu v-model="filters.types" multiple :items="fileTypes" :search-input="false" placeholder="Types" class="w-32" @update:model-value="updateFilters" />
        <CommonDateRangePicker v-model="selected" @date-updated="updateFilters" />
        <USelectMenu v-model="filters.order_by" :items="orderOptions" option-attribute="label" :search-input="false" placeholder="Order by" class="w-32" @update:model-value="updateFilters" />
        <USelectMenu v-model="filters.order_dir" :items="['asc', 'desc']" placeholder="Direction" :search-input="false" class="w-32" @update:model-value="updateFilters" />
        <UButton icon="i-heroicons-trash" color="error" variant="soft" @click="resetFilters" />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { DateFilter } from '~/types'

const store = useDriveStore()
const route = useRoute()
const router = useRouter()

const fileTypes = ['image', 'video']

const orderOptions = [
  { label: 'Date modif.', value: 'last_modified_at' },
  { label: 'Pertinence', value: 'relevance' }
]

const filters = reactive({
  types: route.query.types ? (Array.isArray(route.query.types) ? route.query.types.filter((type): type is string => typeof type === 'string') : typeof route.query.types === 'string' ? [route.query.types] : []) : [],
  order_by: orderOptions.find((o) => o.value === route.query.order_by) || orderOptions[0],
  order_dir: typeof route.query.order_dir === 'string' && ['asc', 'desc'].includes(route.query.order_dir) ? route.query.order_dir : 'desc'
})

const selected = ref<DateFilter>({
  start: null,
  end: null,
  modified_at: route.query.modified_at === 'custom' ? 'custom' : null
})

if (route.query.modified_after && typeof route.query.modified_after === 'string') {
  selected.value.start = new Date(parseInt(route.query.modified_after) * 1000)
}
if (route.query.modified_before && typeof route.query.modified_before === 'string') {
  selected.value.end = new Date(parseInt(route.query.modified_before) * 1000)
}

const updateFilters = () => {
  const hasDateRange = selected.value.start && selected.value.end
  const isCustomDate = selected.value.modified_at === 'custom' && hasDateRange
  const isPresetDate = selected.value.modified_at && selected.value.modified_at !== 'custom'

  // Vérification supplémentaire pour éviter les erreurs de validation de l'api car on peut avoir une date de début et de fin identiques
  if (isCustomDate && selected.value.start && selected.value.end) {
    const startTime = selected.value.start.getTime()
    const endTime = selected.value.end.getTime()

    // Si les dates sont identiques ou si la fin est avant le début
    if (startTime >= endTime) {
      // On ajoute un jour à la date de fin
      selected.value.end = new Date(startTime + 24 * 60 * 60 * 1000)
    }
  }

  let query: Record<string, string | number | string[] | undefined | null> = {
    ...route.query,
    types: filters.types.length ? filters.types : undefined,
    order_by: filters.order_by?.value || undefined,
    order_dir: filters.order_dir || undefined,
    modified_at: isPresetDate ? selected.value.modified_at : hasDateRange ? 'custom' : undefined,
    modified_after: isCustomDate && selected.value.start ? Math.floor(selected.value.start.getTime() / 1000) : undefined,
    modified_before: isCustomDate && selected.value.end ? Math.floor(selected.value.end.getTime() / 1000) : undefined
  }

  query = Object.fromEntries(Object.entries(query).filter(([_, value]) => value !== undefined))

  router.replace({ query })

  let apiParams = {
    order_by: filters.order_by?.value,
    order_dir: filters.order_dir,
    types: filters.types.length ? filters.types : undefined,
    modified_at: isPresetDate ? selected.value.modified_at : hasDateRange ? 'custom' : undefined,
    modified_after: isCustomDate && selected.value.start ? Math.floor(selected.value.start.getTime() / 1000) : undefined,
    modified_before: isCustomDate && selected.value.end ? Math.floor(selected.value.end.getTime() / 1000) : undefined
  }

  apiParams = Object.fromEntries(Object.entries(apiParams).filter(([_, value]) => value !== undefined)) as {
    order_by: string | undefined
    order_dir: string
    types: string[] | undefined
    modified_at: string | null | undefined
    modified_after: number | undefined
    modified_before: number | undefined
  }

  store.fetchFiles(route.params.id as string, true, apiParams)
}

const resetFilters = () => {
  filters.types = []
  filters.order_by = orderOptions[0]
  filters.order_dir = 'desc'
  selected.value = {
    start: null,
    end: null,
    modified_at: null
  }
  updateFilters()
}
</script>
