import type { ApiResponse, Drive, Products } from '@/types'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')

  try {
    const productsResponse = await $fetch<ApiResponse<{ data: Products }>>(`https://api.infomaniak.com/1/products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const product = Array.isArray(productsResponse?.data) ? productsResponse.data.find((p: Products) => p.service_name === 'drive') : undefined

    if (!product) {
      throw createError({ statusCode: 404, message: 'No Kdrive product found' })
    }
    const account_id = product?.account_id

    const drivesResponse = await $fetch<ApiResponse<{ file: Drive }>>(`https://api.infomaniak.com/2/drive?account_id=${account_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return drivesResponse
  } catch (error: unknown) {
    const err = error as { response?: { status: number; statusText: string } }
    throw createError({ statusCode: err.response?.status || 500, message: err.response?.statusText || 'Failed to fetch drives' })
  }
})
