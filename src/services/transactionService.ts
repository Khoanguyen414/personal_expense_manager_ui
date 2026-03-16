import apiClient from './api'

export default {
  getAll() {
    return apiClient.get('/transactions')
  },

  create(data: any) {
    return apiClient.post('/transactions', data)
  },

  update(id: number, data: any) {
    return apiClient.put(`/transactions/${id}`, data)
  },
  
  delete(id: number) {
    return apiClient.delete(`/transactions/${id}`)
  },
}
