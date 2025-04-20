<template>
  <div class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-4 rounded-xl bg-white p-3 shadow-xl backdrop-blur sm:flex-row dark:bg-gray-900">
    <USelectMenu v-model="filters.types" multiple :items="fileTypes" placeholder="Types" class="w-32" @update:model-value="updateFilters" />

    <USelectMenu v-model="filters.modified_at" :items="modifiedDateOptions" placeholder="Modified" class="w-32" @update:model-value="updateFilters" />

    <USelectMenu v-model="filters.order_by" :items="orderOptions" option-attribute="label" placeholder="Order by" class="w-32" @update:model-value="updateFilters" />

    <UButton icon="i-heroicons-trash" color="error" variant="soft" @click="resetFilters" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const store = useDriveStore()
const route = useRoute()
const router = useRouter()

const fileTypes = ['image', 'video']
const modifiedDateOptions = ['today', 'yesterday', 'this_week', 'this_month', 'this_year', 'last_week', 'last_month']

const orderOptions = [
  { label: 'Date modif.', value: 'last_modified_at' },
  { label: 'Pertinence', value: 'relevance' }
]

const filters = reactive({
  types: route.query.types ? (Array.isArray(route.query.types) ? route.query.types.filter((type): type is string => typeof type === 'string') : typeof route.query.types === 'string' ? [route.query.types] : []) : [],
  modified_at: typeof route.query.modified_at === 'string' ? route.query.modified_at : undefined,
  order_by: orderOptions.find((o) => o.value === route.query.order_by) || undefined
})

const updateFilters = () => {
  const query = {
    ...route.query,
    types: filters.types.length ? filters.types : undefined,
    modified_at: filters.modified_at,
    order_by: filters.order_by?.value || undefined
  }

  router.replace({ query })
  store.fetchFiles(route.params.id as string, true, {
    order_by: filters.order_by?.value,
    modified_at: filters.modified_at,
    types: filters.types
  })
}

const resetFilters = () => {
  filters.types = []
  filters.modified_at = undefined
  filters.order_by = undefined
  updateFilters()
}
</script>
