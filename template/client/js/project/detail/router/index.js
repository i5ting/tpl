import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/js/project/detail/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})
