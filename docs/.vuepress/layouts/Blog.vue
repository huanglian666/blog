<script setup>
import { Blog } from "vuepress-theme-hope/blog"
import HitokotoBlogHero from "vuepress-theme-hope/presets/HitokotoBlogHero.js"
import RandomHeroBackground from "../components/RandomHeroBackground.vue"
</script>

<template>
  <Blog>
    <template #heroInfo="info">
      <HitokotoBlogHero v-bind="info" />
    </template>
    <template #heroBg>
      <RandomHeroBackground />
    </template>
  </Blog>
</template>
