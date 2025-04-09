<template>
    <UContainer class="max-w-md mt-20">
        <UCard>
            <template #header>
                <div class="flex justify-center">
                    <h1 class="text-2xl font-bold">Sign in</h1>
                </div>
            </template>

            <UForm name="login" class="space-y-4" @submit="handleLogin" :state="{ valid: true }">
                <UFormField help="Enter your Infomaniak API token" class="w-full">
                    <UInput v-model="token" placeholder="Your API token" type="password" icon="i-heroicons-key"
                        autocomplete="off" class="w-full" />
                </UFormField>
                <UButton color="primary" type="submit" block :loading="isLoading" :disabled="!token">
                    Sign in
                </UButton>
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