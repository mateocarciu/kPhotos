<template>
    <UContainer class="py-12">
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <UAvatar v-if="user?.avatar" :src="user.avatar" :alt="user?.display_name || 'Avatar'"
                            size="xl" />
                        <div>
                            <h1 class="text-2xl font-bold">My Account</h1>
                            <p class="text-gray-500">Manage your personal information and security settings</p>
                        </div>
                    </div>
                    <UButton v-if="!isEditing" color="primary" icon="i-heroicons-pencil-square"
                        @click="isEditing = true">
                        Edit
                    </UButton>
                </div>
            </template>

            <div class="space-y-8">
                <!-- Personal Information -->
                <div>
                    <h2 class="text-xl font-semibold mb-4">Personal Information</h2>

                    <div v-if="!isEditing" class="grid md:grid-cols-2 gap-6">
                        <UCard>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Username</span>
                                    <span class="font-medium">{{ user?.login }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Last name</span>
                                    <span class="font-medium">{{ user?.lastname }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">First name</span>
                                    <span class="font-medium">{{ user?.firstname }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Display name</span>
                                    <span class="font-medium">{{ user?.display_name }}</span>
                                </div>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Email</span>
                                    <span class="font-medium">{{ user?.email }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Phone</span>
                                    <span class="font-medium">{{ user?.sms_phone }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Country</span>
                                    <span class="font-medium">{{ user?.country?.name }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Language</span>
                                    <span class="font-medium">{{ user?.locale }}</span>
                                </div>
                            </div>
                        </UCard>
                    </div>

                    <!-- Edit Form -->
                    <div v-else>
                        <UForm :state="form" class="grid md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <UFormField label="First name" name="firstname">
                                    <UInput v-model="form.firstname" placeholder="Your first name" />
                                </UFormField>
                                <UFormField label="Last name" name="lastname">
                                    <UInput v-model="form.lastname" placeholder="Your last name" />
                                </UFormField>
                            </div>
                            <div class="space-y-4">
                                <UFormField label="Email" name="email">
                                    <UInput v-model="form.email" placeholder="Your email" type="email" />
                                </UFormField>
                                <UFormField label="Phone" name="sms_phone">
                                    <UInput v-model="form.sms_phone" placeholder="Your phone number" />
                                </UFormField>
                            </div>
                        </UForm>

                        <div class="mt-6 flex justify-end gap-3">
                            <UButton color="neutral" @click="cancelEdit">Cancel</UButton>
                            <UButton color="primary" :loading="isLoading" @click="updateProfile">Save</UButton>
                        </div>
                    </div>
                </div>

                <!-- Security -->
                <div>
                    <h2 class="text-xl font-semibold mb-4">Security</h2>
                    <UCard>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-medium">Two-Factor Authentication</h3>
                                    <p class="text-sm text-gray-500">Current method: {{ user?.double_auth_method ===
                                        'sms' ? 'SMS' :
                                        user?.double_auth_method }}</p>
                                </div>
                                <UBadge v-if="user?.double_auth" color="success">Enabled</UBadge>
                                <UBadge v-else color="error">Disabled</UBadge>
                            </div>

                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-medium">Last password change</h3>
                                    <p class="text-sm text-gray-500">{{ user?.date_last_change_password ?
                                        formatDate(user.date_last_change_password) : 'N/A' }}
                                    </p>
                                </div>
                                <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-key">
                                    Change
                                </UButton>
                            </div>

                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-medium">Rescue codes</h3>
                                    <p class="text-sm text-gray-500">{{ user?.remaining_rescue_code }} codes left</p>
                                </div>
                                <UButton size="sm" color="neutral" variant="ghost"
                                    icon="i-heroicons-document-duplicate">
                                    Generate
                                </UButton>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Login Activity -->
                <div>
                    <h2 class="text-xl font-semibold mb-4">Login Activity</h2>
                    <UCard>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-500">Last login</span>
                                <span class="font-medium">{{ user?.last_login_at ? formatDate(user.last_login_at) :
                                    'N/A' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500">Last admin login</span>
                                <span class="font-medium">{{ user?.administration_last_login_at ?
                                    formatDate(user.administration_last_login_at) : 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-500">Login notification</span>
                                <div class="flex gap-4">
                                    <UBadge v-if="user?.successful_connexion_notification" color="success">Successful
                                    </UBadge>
                                    <UBadge v-else color="neutral">Disabled</UBadge>
                                    <UBadge v-if="user?.unsuccessful_connexion_notification" color="error">Failed
                                    </UBadge>
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

const { user } = useUser();
const toast = useToast();
const isEditing = ref(false);
const isLoading = ref(false);

const form = reactive({
    firstname: user.value?.firstname || '',
    lastname: user.value?.lastname || '',
    email: user.value?.email || '',
    sms_phone: user.value?.sms_phone || '',
});

const authMethods = [
    { value: 'sms', label: 'SMS' },
    { value: 'otp', label: 'Authenticator App' },
    { value: 'yubikey', label: 'Yubikey' },
];

// Function to update the profile
const updateProfile = async () => {
    isLoading.value = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // await updateUserProfile(form);

        toast.add({
            title: 'Profile updated',
            description: 'Your information has been successfully saved',
            color: 'success'
        });

        isEditing.value = false;
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'Unable to update your profile',
            color: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};

// Function to cancel editing
const cancelEdit = () => {
    form.firstname = user.value?.firstname || '';
    form.lastname = user.value?.lastname || '';
    form.email = user.value?.email || '';
    form.sms_phone = user.value?.sms_phone || '';
    isEditing.value = false;
};

// Format last login date
const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>