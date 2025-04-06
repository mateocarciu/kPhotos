<template>
    <div>
        <div class="my-24 grid max-w-7xl gap-16 sm:grid-cols-2 sm:gap-y-24 lg:items-center">
            <div>
                <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                    Dasshhhboard
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: ['auth'],
});

const { user } = useUser()

</script>