import GestionClientes from '@/app/views/pages/GestionClientes.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'clientes',
      component: GestionClientes,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import(''),
    // },
  ],
})

export default router
