export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const productsResponse = await $fetch(`https://api.infomaniak.com/1/products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const product = productsResponse?.data?.find((p: any) => p.service_name === 'drive')

    if (!product) {
      throw createError({ statusCode: 404, message: 'No Kdrive product found' })
    }
    const account_id = product?.account_id

    const drivesResponse = await $fetch(`https://api.infomaniak.com/2/drive?account_id=${account_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return drivesResponse
  } catch (error: any) {
    throw createError({ statusCode: error?.response?.status || 500, message: error?.response?.statusText || 'Failed to fetch drives' })
  }
})
