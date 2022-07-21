import DefaultTheme from 'vitepress/theme'
import MyLayout from "./components/MyLayout.vue"
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import * as ElIcons from '@element-plus/icons-vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as AntdIcons from '@ant-design/icons-vue'


import './custom.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // 全局注册ElementPlus的所有图标
    for (const [key, elIcon] of Object.entries(ElIcons)) {
      app.component(key, elIcon)
    }
    // 全局注册ElementPlus
    app.use(ElementPlus)

    // 全局注册Ant Design of Vue的所有图标
    for (const [key, antdIcon] of Object.entries(AntdIcons)) {
      app.component(key, antdIcon)
    }
    // 全局注册Ant Design of Vue
    app.use(Antd)
  }
}