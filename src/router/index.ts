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
      name: 'start',
      component: () => import('@/pages/User/StartView.vue'),
      redirect: { name: 'login' },
      children: [
        {
          path: '/user/log-in',
          name: 'login',
          component: () => import('@/pages/User/UserLogin.vue')
        },
        {
          path: '/user/sign-up',
          name: 'signup',
          component: () => import('@/pages/User/UserSignup.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'expenses',
      component: StartView,
      meta: { requiresAuth: true }
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
