import { createRouter, createWebHistory } from 'vue-router'
import AdvancedUser from '../views/AdvancedUser.vue'
import Default from '../views/Default.vue'

const routes = [
  { path: '/', name: 'Default', component: Default },
  { path: '/advanced', name: 'AdvancedUser', component: AdvancedUser },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
