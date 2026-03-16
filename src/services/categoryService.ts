import apiClient from './api'

export default {
  getAll() {
    return apiClient.get('/categories')
  },

  create(data: any) {
    return apiClient.post('/categories', data)
  },

  update(id: number, data: any) {
    return apiClient.put(`/categories/${id}`, data)
  },
  
  delete(id: number) {
    return apiClient.delete(`/categories/${id}`)
  },
}
