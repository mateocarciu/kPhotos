import type { UserProfile } from '~/types'
import { useApiFetch } from '~/utils/useApiFetch'

export const login = (token: string) =>
  useApiFetch<{ profile: UserProfile }>('/api/auth/login', {
    method: 'POST',
    body: { token }
  })

export const logout = () =>
  useApiFetch('/api/auth/logout', {
    method: 'POST'
  })

export const fetchProfile = () => useApiFetch<{ profile: UserProfile }>('/api/account/profile')
