import type { DriveResponse } from '~/types'
import { useApiFetch } from '~/utils/useApiFetch'

export const fetchFiles = () => useApiFetch<{ data: DriveResponse }>('/api/drives')
