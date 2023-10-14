import { createRouter, createWebHistory } from 'vue-router'
import StartView from '@/pages/StartView.vue'
import { loggedIn } from '@/utils/loggedIn'

const setPageTitle = (title = 'Start') => {
  document.title = `MyExpenses | ${ title }`
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/pages/User/UserLogin.vue')
    },
    {
      path: '/',
      name: 'start',
      component: StartView,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/User/UserSignup.vue')
    }
  ]
})

router.beforeEach((to) => {
  if ( to.meta.requiresAuth && !loggedIn() )
    return { name: 'login' }
})

router.afterEach(() => {
  setPageTitle()
})

export default router
