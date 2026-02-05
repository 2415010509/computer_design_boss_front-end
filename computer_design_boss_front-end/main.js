import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false

// 引入uni-ui组件
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import uniDatePicker from '@dcloudio/uni-ui/lib/uni-datetime-picker/uni-datetime-picker.vue'
import uniDataPicker from '@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker.vue'

// 注册组件
Vue.component('uni-icons', uniIcons)
Vue.component('uni-date-picker', uniDatePicker)
Vue.component('uni-data-picker', uniDataPicker)

App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 引入uni-ui组件
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import uniDatePicker from '@dcloudio/uni-ui/lib/uni-datetime-picker/uni-datetime-picker.vue'
import uniDataPicker from '@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 注册组件
  app.component('uni-icons', uniIcons)
  app.component('uni-date-picker', uniDatePicker)
  app.component('uni-data-picker', uniDataPicker)
  
  return {
    app
  }
}
// #endif