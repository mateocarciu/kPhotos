import type { Drive } from '~/types'
import { useApiFetch } from '~/utils/useApiFetch'

export const fetchDrives = () => useApiFetch<{ data: Drive }>('/api/drives')
