<template>
  <UContainer class="mt-20 max-w-md">
    <UCard>
      <template #header>
        <div class="flex justify-center">
          <h1 class="text-2xl font-bold">Log in</h1>
        </div>
      </template>

      <UForm name="login" class="space-y-4" :state="{ valid: true }" @submit="handleLogin">
        <UFormField help="Enter your Infomaniak API token" class="w-full">
          <UInput v-model="token" placeholder="Your Infomaniak API token" type="password" icon="i-heroicons-key" autocomplete="off" autofocus class="w-full" />
        </UFormField>
        <UButton color="primary" type="submit" block :loading="isLoading" :disabled="!token"> Log in </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { isLoading } = useUser()

const token = ref('')
const toast = useToast()

const handleLogin = async () => {
  if (!token.value) {
    toast.add({
      title: 'Error',
      description: 'Please enter your API token',
      color: 'error'
    })
    return
  }
  await userStore.login(token.value)
}
</script>
