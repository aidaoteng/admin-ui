<script setup lang="ts">
import type {FormInst} from 'naive-ui'
import {$t, local} from '@/utils'
import { useAuthStore } from '@/store'
import {fetchVerCode} from "@/service";

const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()
function toOtherForm(type: any) {
  emit('update:modelValue', type)
}

const rules = computed(() => {
  return {
    account: {
      required: true,
      trigger: 'blur',
      message: '请输入账户',
    },
    pwd: {
      required: true,
      trigger: 'blur',
      message: '请输入密码',
    },
    code: {
      required: true,
      trigger: 'blur',
      message: '验证码不能为空',
    },
  }
})
const formValue = ref({
  account: 'admin',
  pwd: 'admin123',
  code: '',
  uuid: ''
})
const isRemember = ref(false)
const isLoading = ref(false)
const imgVerCode = ref('')

const formRef = ref<FormInst | null>(null)
function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    isLoading.value = true
    const { account, pwd , code } = formValue.value

    if (isRemember.value)
      local.set('loginAccount', { account, pwd })
    else local.remove('loginAccount')

    await authStore.login(account, pwd, code, formValue.value.uuid).then((res: any) => {
      getVerCode()
      formValue.value.code = '';

    }).catch((err: any) => {
      isLoading.value = false
    })
    isLoading.value = false
  })
}


function checkUserAccount() {
  const loginAccount = local.get('loginAccount')
  if (!loginAccount)
    return

  formValue.value = loginAccount
  isRemember.value = true
}

async function getVerCode() {
  const {data} = await fetchVerCode()
  if (data) {
    imgVerCode.value = 'data:image/jpeg;base64,' + data.imgBase64
    formValue.value.uuid = data.imgUuid
  }
}

//点击回车键登录
const keyDown = (e:any) => {
  if (e.keyCode == 13) {
    handleLogin()
  }
}


onMounted(() => {
  getVerCode()
  checkUserAccount()
  window.addEventListener('keydown', keyDown, true)
})



</script>

<template>
  <div>
<!--    <n-h2 depth="3" class="text-center">-->
<!--      {{ $t('login.signInTitle') }}-->
<!--    </n-h2>-->
    <n-form ref="formRef" :rules="rules" :model="formValue" :show-label="false" size="large">
      <n-form-item path="account">
        <n-input v-model:value="formValue.account" clearable :placeholder="$t('login.accountPlaceholder')" />
      </n-form-item>
      <n-form-item path="pwd">
        <n-input v-model:value="formValue.pwd" type="password" :placeholder="$t('login.passwordPlaceholder')" clearable show-password-on="click">
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="code">
          <n-space class="mr-2">
              <n-input v-model:value="formValue.code" clearable placeholder="请输入验证码" maxlength="4"/>
          </n-space>
          <n-space><img :src="imgVerCode" alt="" class="h-40px" @click="getVerCode"/></n-space>
      </n-form-item>
      <n-space vertical :size="20">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="isRemember">
            {{ $t('login.rememberMe') }}
          </n-checkbox>
          <n-button type="primary" text @click="toOtherForm('resetPwd')">
            {{ $t('login.forgotPassword') }}
          </n-button>
        </div>
        <n-button block type="primary" size="large" :loading="isLoading" :disabled="isLoading" @click="handleLogin">
          {{ $t('login.signIn') }}
        </n-button>
<!--        <n-flex>-->
<!--          <n-text>{{ $t('login.noAccountText') }}</n-text>-->
<!--          <n-button type="primary" text @click="toOtherForm('register')">-->
<!--            {{ $t('login.signUp') }}-->
<!--          </n-button>-->
<!--        </n-flex>-->
      </n-space>
    </n-form>
<!--    <n-divider>
      <span op-80>{{ $t('login.or') }}</span>
    </n-divider>
    <n-space justify="center">
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-wechat /></n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-tencent-qq /></n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-github-one /></n-icon>
        </template>
      </n-button>
    </n-space>-->
  </div>
</template>

<style scoped></style>
