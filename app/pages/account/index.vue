<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UAvatar v-if="user?.avatar" :src="user.avatar" :alt="user?.display_name || 'Avatar'" size="xl" />
          <div>
            <h1 class="text-2xl font-bold">My Account</h1>
            <p class="text-gray-500">Manage your personal information and security settings</p>
          </div>
        </div>
      </template>

      <div class="space-y-8">
        <!-- Personal Information -->
        <div>
          <h2 class="mb-4 text-xl font-semibold">Personal Information</h2>
          <div class="grid gap-6 md:grid-cols-2">
            <UCard>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Username</span><span class="font-medium">{{ user?.login }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Last name</span><span class="font-medium">{{ user?.lastname }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">First name</span><span class="font-medium">{{ user?.firstname }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Display name</span><span class="font-medium">{{ user?.display_name }}</span>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Email</span><span class="font-medium">{{ user?.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Phone</span><span class="font-medium">{{ user?.sms_phone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Country</span><span class="font-medium">{{ user?.country?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Language</span><span class="font-medium">{{ user?.locale }}</span>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Security -->
        <div>
          <h2 class="mb-4 text-xl font-semibold">Security</h2>
          <UCard>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">Two-Factor Authentication</h3>
                  <p class="text-sm text-gray-500">Current method: {{ user?.double_auth_method === 'sms' ? 'SMS' : user?.double_auth_method }}</p>
                </div>
                <UBadge v-if="user?.double_auth" color="success">Enabled</UBadge>
                <UBadge v-else color="error">Disabled</UBadge>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">Last password change</h3>
                  <p class="text-sm text-gray-500">{{ user?.date_last_change_password ? formatDate(user.date_last_change_password) : 'N/A' }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">Rescue codes</h3>
                  <p class="text-sm text-gray-500">{{ user?.remaining_rescue_code }} codes left</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Login Activity -->
        <div>
          <h2 class="mb-4 text-xl font-semibold">Login Activity</h2>
          <UCard>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">Last login</span>
                <span class="font-medium">{{ user?.last_login_at ? formatDate(user.last_login_at) : 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Last admin login</span>
                <span class="font-medium">{{ user?.administration_last_login_at ? formatDate(user.administration_last_login_at) : 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Login notification</span>
                <div class="flex gap-4">
                  <UBadge v-if="user?.successful_connexion_notification" color="success">Successful</UBadge>
                  <UBadge v-else color="neutral">Disabled</UBadge>
                  <UBadge v-if="user?.unsuccessful_connexion_notification" color="error">Failed</UBadge>
                  <UBadge v-else color="neutral">Disabled</UBadge>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { formatDate } from '#imports'

const { user } = useUser()
</script>
