<script setup>
import { onMounted, ref } from "vue"

const imageUrl = ref("")

onMounted(() => {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  imageUrl.value = `https://picsum.photos/seed/${seed}/1920/1080`
})
</script>

<template>
  <div
    class="vp-blog-mask random-hero-mask"
    :style="{
      background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : undefined,
    }"
    aria-hidden="true"
  />
</template>
