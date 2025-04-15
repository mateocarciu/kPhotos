<template>
    <div class="my-8">
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <pre v-else>{{ files }}</pre>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { files, isLoading, error, fetchFiles } = useDrive()

const drive_id = route.params.id as string
const file_id = (route.params.file_id as string) || '5'

onMounted(() => {
    fetchFiles(drive_id, file_id)
})
</script>