<template>
  <UPopover :content="{ align: 'start' }" modal>
    <UButton icon="i-lucide-calendar" variant="outline" color="neutral">
      <span class="truncate">{{ displayLabel }}</span>
      <template #trailing>
        <UIcon name="i-lucide-chevron-down" />
      </template>
    </UButton>

    <template #content>
      <div class="flex w-full items-stretch divide-x divide-(--ui-border)">
        <aside class="hidden flex-col sm:flex">
          <UButton v-for="option in shortcuts" :key="option.id" class="rounded-none px-4 text-left hover:bg-(--ui-bg-elevated)" variant="ghost" color="neutral" :label="option.label" @click="applyShortcut(option)" />
        </aside>
        <UCalendar v-model="internalRange" :number-of-months="numberOfMonths" range class="p-2" />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { getLocalTimeZone, CalendarDate, DateFormatter } from '@internationalized/date'
import type { DateFilter } from '~/types'

const emit = defineEmits(['date-updated'])
const selected = defineModel<DateFilter>({ required: true })
const formatDate = new DateFormatter('en-EN', { dateStyle: 'medium' })

const shortcuts = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This Week' },
  { id: 'last_week', label: 'Last Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'this_year', label: 'This Year' }
]
const toCalendarDate = (d: Date) => new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())

const numberOfMonths = computed(() => {
  if (import.meta.client) {
    return window.innerWidth < 640 ? 1 : 2
  }
  return 2
})

const internalRange = computed({
  get: () => ({
    start: selected.value.start ? toCalendarDate(selected.value.start) : undefined,
    end: selected.value.end ? toCalendarDate(selected.value.end) : undefined
  }),
  set: ({ start, end }) => {
    // Si les dates de début et de fin sont identiques on ajoute un jour à la date de fin pour éviter l'erreur API
    let endDate = end?.toDate(getLocalTimeZone()) ?? null
    const startDate = start?.toDate(getLocalTimeZone()) ?? null

    if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
      endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
    }

    selected.value = {
      ...selected.value,
      start: startDate,
      end: endDate,
      modified_at: 'custom'
    }

    emit('date-updated')
  }
})

const displayLabel = computed(() => {
  const { start, end, modified_at } = selected.value

  const shortcut = shortcuts.find((s) => s.id === modified_at)
  if (shortcut) return shortcut.label

  if (!start) return 'Pick a date'
  return end ? `${formatDate.format(start)} - ${formatDate.format(end)}` : formatDate.format(start)
})

const applyShortcut = (shortcut: { id: string; label: string }) => {
  const now = new Date()
  let start: Date
  let end: Date

  switch (shortcut.id) {
    case 'today':
      start = end = now
      break
    case 'yesterday':
      start = end = new Date(now)
      start.setDate(start.getDate() - 1)
      break
    case 'this_week': {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) // lundi
      start = new Date(now.setDate(diff))
      end = new Date()
      break
    }
    case 'last_week': {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7
      start = new Date(now.setDate(diff))
      end = new Date(now)
      end.setDate(start.getDate() + 6)
      break
    }
    case 'this_month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = now
      break
    case 'last_month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      end = new Date(now.getFullYear(), now.getMonth(), 0) // dernier jour du mois précédent
      break
    case 'this_year':
      start = new Date(now.getFullYear(), 0, 1)
      end = now
      break
    default:
      return
  }

  selected.value = {
    start,
    end,
    modified_at: shortcut.id
  }

  emit('date-updated')
}
</script>
