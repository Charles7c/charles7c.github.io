<template>
  <div id="wordcloud-container"></div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeUnmount, watch } from 'vue'
import { WordCloud, G2 } from '@antv/g2plot'
import { debounce, useDark } from '@pureadmin/utils'

// 定义属性
const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  }
})


// 渲染WordCloud
const theme = G2.getTheme('dark')
G2.registerTheme('customize-dark', {
  ...theme,
  background: 'transparent',
})

const { isDark } = useDark()
let wordCloud
debounce(() => {
  wordCloud = new WordCloud("wordcloud-container", {
    data: props.dataList,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [14, 35],
      rotation: 0,
    },
    theme: isDark.value ? 'customize-dark' : 'light',
    // 返回值设置成一个 [0, 1) 区间内的值，
    // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
    random: () => 0.5,
  })
  wordCloud.render()
}, 20)()

watch(isDark, (value) => {
  value
    ? wordCloud?.update({ theme: 'customize-dark' })
    : wordCloud?.update({ theme: 'light' })
})

onBeforeUnmount(() => {
  wordCloud.destroy()
})
</script>