import { createRouter, createWebHistory } from 'vue-router'
import StartView from '@/pages/StartView.vue'

const setPageTitle = (title = 'Start') => {
  document.title = `MyExpenses | ${ title }`
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView
    }
  ]
})

router.afterEach(() => {
  setPageTitle()
})

export default router
