import DefaultTheme from 'vitepress/theme'
import MyLayout from "./MyLayout.vue"
import './styles/vars.css'
import './styles/custom.css'
import ArticleMetadata from './components/ArticleMetadata.vue'
import WordCloud from './components/WordCloud.vue'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    app.component('ArticleMetadata', ArticleMetadata)
    app.component('WordCloud', WordCloud)
  }
}