import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import axios, { type AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

const client = axios.create({
  baseURL: `${ import.meta.env.VITE_API_URL }/api/v1`,
  withCredentials: false,
  timeout: 60000
})

type ParameterType = {
  data: Record<string, unknown> | Date | string | Record<string, unknown>[]
}

client.interceptors.request.use(req => {
  if ( useUserStore().currentUser?.token )
    req.headers.Authorization  = useUserStore().currentUser?.token
  return req
}, err => {
  console.log(err);
  if ( [401, 403].includes(err.response?.status) ) {
    useUserStore().clearUser()
    useToastStore().setToast(true, err.response.data, true)
    useRouter().replace({ name: 'login' })
  }

  return Promise.reject(err)
})

client.interceptors.response.use(res => {
  return res
}, err => {
  console.log(err);
  if ( [401, 403].includes(err.response?.status) ) {
    useUserStore().clearUser()
    useToastStore().setToast(true, err.response.data, true)
    useRouter().replace({ name: 'login' })
  }

  return Promise.reject(err)
})

export default {
  //- Expenses
  createExpense(params: ParameterType): Promise<AxiosResponse> {
    return client.post('/expenses/create', params)
  },
  listExpenses(params: ParameterType): Promise<AxiosResponse> {
    return client.patch('/expenses/list', params)
  },
  updateExpense(id: string, params: ParameterType): Promise<AxiosResponse> {
    return client.patch(`/expenses/${ id }/update`, params)
  },
  deleteExpense(id: string): Promise<AxiosResponse> {
    return client.delete(`/expenses/${ id }/delete`)
  },
  updateSelectedRows(params: ParameterType): Promise<AxiosResponse> {
    return client.patch(`/expenses/update-selected`, params)
  },

  //- Income
  updateIncome(params: ParameterType): Promise<AxiosResponse> {
    return client.patch('/income/update', params)
  },
  getIncome(): Promise<AxiosResponse> {
    return client.get('/income/get')
  },
  createIncome(params: ParameterType): Promise<AxiosResponse> {
    return client.post('/income/create', params)
  },
  listIncome(): Promise<AxiosResponse> {
    return client.patch('/income/list')
  },

  //- Category
  createCategory(params: ParameterType): Promise<AxiosResponse> {
    return client.post('/categories/create', params)
  },
  listCategories(): Promise<AxiosResponse> {
    return client.get('/categories/list')
  },
  updateCategory(id: string, params: ParameterType): Promise<AxiosResponse> {
    return client.patch(`/categories/${ id }/update`, params)
  },
  deleteCategory(id: string): Promise<AxiosResponse> {
    return client.delete(`/categories/${ id }/delete`)
  },

  //- User
  createUser(params: ParameterType): Promise<AxiosResponse> {
    return client.post('/users/create', params)
  },
  authUser(params: ParameterType): Promise<AxiosResponse> {
    return client.post('/users/auth', params)
  },
  getUser(id: string): Promise<AxiosResponse> {
    return client.get(`/users/${ id }/get`)
  },
}