<template>
  <UButton v-if="visible" icon="i-heroicons-chevron-up" class="fixed right-6 bottom-6 z-50 shadow-lg" size="lg" color="primary" variant="solid" @click="scrollToTop" />
</template>

<script setup lang="ts">
const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
