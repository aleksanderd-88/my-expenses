import { createRouter, createWebHistory } from 'vue-router'
import StartView from '@/pages/StartView.vue'
import { useUserStore } from '@/stores/user'
import { useAppMenu } from '@/stores/menu'

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
  const user = JSON.parse(localStorage.getItem('__user__') as string)

  //- First check - Always set user data if already logged in
  if ( user ) {
    useUserStore().setUser(user) 
  }
  
  //- Prohibit user from navigating to unprotected route(s) when logged in
  if ( !to.meta.requiresAuth && user ) {
    useUserStore().setUser(user)
    return { name: 'expenses' }
  }

  //- Prevent navigating to protected route if user is not set
  if ( to.meta.requiresAuth && !user ) {
    useAppMenu().setMenuVisibility(false)
    return false
  }

  //- Continue with navigation to unprotected route(s)
  return true
})

router.afterEach(() => {
  setPageTitle()
})

export default router
