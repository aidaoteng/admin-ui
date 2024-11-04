<script setup lang="ts">
import {Login, Register, ResetPwd} from './components'

type IformType = 'login' | 'register' | 'resetPwd'
const formType: Ref<IformType> = ref('login')
const formComponets = {
  login: Login,
  register: Register,
  resetPwd: ResetPwd,
}

const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
  <n-el class="wh-full flex-center login-bg">
    <n-el  class="p-4xl h-full w-full sm:w-450px sm:h-450px shadow-lg bg-white border-rd-8">
      <div class="w-full flex flex-col items-center">
        <n-h1>{{ appName }}</n-h1>
        <transition
          name="fade-slide"
          mode="out-in"
        >
          <component
            :is="formComponets[formType]"
            v-model="formType"
            class="w-85%"
          />
        </transition>
      </div>
    </n-el>

    <div/>
  </n-el>
</template>


<style scoped>
.login-bg {
  background-image: url('@/assets/login/bg3.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
