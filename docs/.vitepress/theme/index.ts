import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import './styles/vars.css'
import './styles/custom.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
  }
}