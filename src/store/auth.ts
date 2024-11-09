import { useRouteStore } from './router'
import { useTabStore } from './tab'
import { fetchLogin } from '@/service'
import { router } from '@/router'
import { local } from '@/utils'

interface AuthStatus {
  userInfo: Api.Login.Info | null
  token: string
}

const clientId = import.meta.env.VITE_APP_CLIENT_ID;

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthStatus => {
    return {
      userInfo: local.get('userInfo'),
      token: local.get('accessToken') || '',
    }
  },
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token)
    },
  },
  actions: {
    /* 登录退出，重置用户信息等 */
    async logout() {
      const route = unref(router.currentRoute)
      // 清除本地缓存
      this.clearAuthStorage()
      // 清空路由、菜单等数据
      const routeStore = useRouteStore()
      routeStore.resetRouteStore()
      // 清空标签栏数据
      const tabStore = useTabStore()
      tabStore.clearAllTabs()
      // 重置当前存储库
      this.$reset()
      // 重定向到登录页
      if (route.meta.requiresAuth) {
        await router.push({
          name: 'login',
          query: {},
        })
      }
    },
    clearAuthStorage() {
      local.remove('accessToken')
      local.remove('refreshToken')
      local.remove('userInfo')
    },

    /* 用户登录 */
      async login(username: string, password: string, code: string, uuid: string) {
      try {
        const pms = {
          tenantId: '000000',
          username: username,
          password: password,
          rememberMe: false,
          socialCode: '',
          socialState: '',
          source: '000000',
          code: code,
          uuid: uuid,
          clientId: clientId,
          grantType: 'password'
        }
        const { isSuccess, data } = await fetchLogin(pms)
        if (!isSuccess)
          return
          // 处理登录信息
        await this.handleLoginInfo(data)
      }
      catch (e) {
        console.warn('[Login Error]:', e)
      }
    },

    async handleLoginInfo(data: Api.Login.Info) {
      // 将token和userInfo保存下来
      local.set('userInfo', data)
      local.set('accessToken', data.accessToken)
      local.set('refreshToken', data.refreshToken)
      local.set('clientId', data.clientId)
      this.token = data.accessToken
      this.userInfo = data

      // 添加路由和菜单
      const routeStore = useRouteStore()
      await routeStore.initAuthRoute()

      // 进行重定向跳转
      const route = unref(router.currentRoute)
      const query = route.query as { redirect: string }
      await router.push({
        path: query.redirect || '/',
      })

      window.$message.success('恭喜您,登陆成功');
    },
  },
})
