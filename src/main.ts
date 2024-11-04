import type { App } from 'vue'
import AppVue from './App.vue'
import AppLoading from './components/common/AppLoading.vue'
import { installRouter } from '@/router'
import { installPinia } from '@/store'

// 完整导入 UI 组件库
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// 完整导入 表格库
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

async function setupApp() {
  // 载入全局loading加载状态
  const appLoading = createApp(AppLoading)
  appLoading.mount('#appLoading')

  // 创建vue实例
  const app = createApp(AppVue)

  // 注册模块Pinia
  await installPinia(app)

  // 注册模块 Vue-router
  await installRouter(app)

  /* 注册模块 指令/静态资源 */
  Object.values(
    import.meta.glob<{ install: (app: App) => void }>('./modules/*.ts', {
      eager: true,
    }),
  ).map(i => app.use(i))

  // 卸载载入动画
  appLoading.unmount()

  // 挂载
  app.use(VxeUI).use(VxeUITable).mount('#app')
}

setupApp()
