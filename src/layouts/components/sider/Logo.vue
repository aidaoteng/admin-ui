<script setup lang="ts">
import { useAppStore } from '@/store'

const router = useRouter()
const appStore = useAppStore()

const name = import.meta.env.VITE_APP_NAME
</script>

<template>
  <div
    class="h-60px text-xl flex-center cursor-pointer gap-2 p-x-2 logo"
    @click="router.push('/')"
  >
    <svg-icons-logo class="text-1.5em" />
    <span
      v-show="!appStore.collapsed"
      class="text-ellipsis overflow-hidden whitespace-nowrap"
    >{{ name }}</span>
  </div>
</template>

<style scoped>
.logo {
  background-color: rgb(0, 20, 40);
  color: #FFFFFF;
}
</style>
