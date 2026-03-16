import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from '@/views/CategoryView.vue'
import AboutView from '@/views/AboutView.vue'
import TransactionView from '@/views/TransactionView.vue'
import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionView,
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryView,
    },
  ],
})

export default router
