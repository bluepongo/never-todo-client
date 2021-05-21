import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/',
      name: 'todo',
      component: require('@/components/Todo').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
