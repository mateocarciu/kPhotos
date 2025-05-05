<template>
  <UTooltip text="Filters">
    <UButton icon="i-heroicons-adjustments-horizontal" class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 shadow-xl" size="lg" color="primary" variant="solid" @click="showFilters = !showFilters" />
  </UTooltip>
  <Transition enter-active-class="transition transform duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition transform duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
    <div v-if="showFilters" class="fixed bottom-[5rem] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-xl backdrop-blur sm:flex-row dark:border-gray-800 dark:bg-gray-900">
      <USelectMenu v-model="filters.types" multiple :items="fileTypes" :search-input="false" placeholder="Types" class="w-32" @update:model-value="updateFilters" />
      <UPopover>
        <UButton color="neutral" variant="outline" icon="i-lucide-calendar" disabled>
          <template v-if="modelValue.start">
            <template v-if="modelValue.end"> {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} - {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }} </template>
          </template>
          <template v-else> Pick a date </template>
        </UButton>

        <template #content>
          <UCalendar v-model="modelValue" :number-of-months="2" range />
        </template>
      </UPopover>
      <USelectMenu v-model="filters.modified_at" :items="modifiedDateOptions" :search-input="false" placeholder="Modified" class="w-32" @update:model-value="updateFilters" />
      <USelectMenu v-model="filters.order_by" :items="orderOptions" option-attribute="label" :search-input="false" placeholder="Order by" class="w-32" @update:model-value="updateFilters" />
      <USelectMenu v-model="filters.order_dir" :items="['asc', 'desc']" placeholder="Direction" :search-input="false" class="w-32" @update:model-value="updateFilters" />
      <UButton icon="i-heroicons-trash" color="error" variant="soft" @click="resetFilters" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const showFilters = ref(false)

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

const modelValue = shallowRef({
  start: null,
  end: null
})
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
  order_by: orderOptions.find((o) => o.value === route.query.order_by) || orderOptions[0],
  order_dir: typeof route.query.order_dir === 'string' && ['asc', 'desc'].includes(route.query.order_dir) ? route.query.order_dir : 'desc'
})

const updateFilters = () => {
  const query = {
    ...route.query,
    types: filters.types.length ? filters.types : undefined,
    modified_at: filters.modified_at,
    order_by: filters.order_by?.value || undefined,
    order_dir: filters.order_dir || undefined
  }

  router.replace({ query })
  store.fetchFiles(route.params.id as string, true, {
    order_by: filters.order_by?.value,
    order_dir: filters.order_dir,
    modified_at: filters.modified_at,
    types: filters.types
  })
}

const resetFilters = () => {
  filters.types = []
  filters.modified_at = undefined
  filters.order_by = orderOptions[0]
  filters.order_dir = 'desc'
  updateFilters()
}
</script>
