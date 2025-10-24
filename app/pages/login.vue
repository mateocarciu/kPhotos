<template>
  <UContainer class="mt-20 max-w-md">
    <UCard>
      <template #header>
        <div class="flex justify-center">
          <h1 class="text-2xl font-bold">Log in</h1>
        </div>
      </template>

      <UForm class="space-y-4" :state="{ valid: true }" @submit="handleLogin">
        <UFormField class="w-full">
          <template #help>
            <div class="text-muted relative flex justify-end gap-1.5 text-xs">
              <span ref="triggerRef" class="cursor-help underline decoration-dotted" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"> Why can't I use OAuth2 ? </span>
              <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="showTooltip" class="fixed z-[9999] w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900" :style="tooltipStyle" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
                  <div class="space-y-3">
                    <p class="text-sm leading-relaxed text-gray-900 dark:text-white">Infomaniak's OAuth2 does not provide the necessary scopes required for this application to function properly. You must use a personal token generated from your Infomaniak account with the required scopes:</p>
                    <div class="flex flex-wrap gap-2">
                      <code class="rounded border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">user_info</code>
                      <code class="rounded border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">drive</code>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </template>
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
const showTooltip = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipStyle = computed(() => {
  if (!triggerRef.value) return {}
  const rect = triggerRef.value.getBoundingClientRect()
  return {
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`
  }
})

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
