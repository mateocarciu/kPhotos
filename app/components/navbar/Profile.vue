<template>
  <ClientOnly>
    <UDropdownMenu v-if="user" :items="items" :ui="{ content: 'divide-gray-200 dark:divide-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 rounded-md shadow-lg', item: 'data-disabled:cursor-text select-text hover:rounded-md hover:bg-gray-100 hover:dark:bg-gray-800' }" :popper="{ placement: 'bottom-start' }">
      <UButton class="inline-flex size-[2.375rem] flex-shrink-0 items-center justify-center gap-2 rounded-full bg-white align-middle text-xs font-medium text-neutral-700 transition-all hover:bg-neutral-50 focus:outline-none dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-slate-800 dark:hover:text-white">
        <UChip inset>
          <UAvatar :ui="{ root: 'ring-2 ring-gray-200 dark:ring-gray-500 bg-neutral-100 dark:bg-neutral-700' }" size="lg" :alt="`${user.firstname} ${user.lastname}`" :src="user.avatar" />
        </UChip>
      </UButton>

      <template #account>
        <div class="max-w-full text-left">
          <p>Signed in as</p>
          <p class="truncate font-medium">{{ user.firstname }} {{ user.lastname }}</p>
        </div>
      </template>

      <template #item="{ item }">
        <span v-if="'label' in item" class="truncate">{{ item.label }}</span>

        <UIcon v-if="'icon' in item && item.icon" :name="item.icon" class="ms-auto h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" />
      </template>
    </UDropdownMenu>
  </ClientOnly>
</template>

<script lang="ts" setup>
const { user } = useUser()
const userStore = useUserStore()

const items = [
  [
    {
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Profile',
      icon: 'i-heroicons-user-circle',
      to: '/account'
    }
  ],
  [
    {
      label: 'Drives',
      icon: 'i-heroicons-folder',
      to: '/drives'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      onSelect: () => logout()
    }
  ]
]

const logout = async () => {
  await userStore.logout()
}
</script>
