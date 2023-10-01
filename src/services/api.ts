import axios, { type AxiosResponse } from 'axios'

const client = axios.create({
  baseURL: `${ import.meta.env.VITE_API_URL }/api/v1`,
  withCredentials: false,
  timeout: 60000
})

type ParameterType = {
  data: Record<string, unknown>
}

export default {
  //- Expenses
  createExpense(params: ParameterType): Promise<AxiosResponse> {
    return client.post('/expenses/create', params)
  },
  listExpenses(): Promise<AxiosResponse> {
    return client.patch('/expenses/list')
  },
  updateExpense(id: string, params: ParameterType): Promise<AxiosResponse> {
    return client.patch(`/expenses/${ id }/update`, params)
  },
  deleteExpense(id: string): Promise<AxiosResponse> {
    return client.delete(`/expenses/${ id }/delete`)
  },

  //- Income
  updateIncome(params: ParameterType): Promise<AxiosResponse> {
    return client.patch('/income/update', params)
  },
  getIncome(): Promise<AxiosResponse> {
    return client.get('/income/get')
  }
}