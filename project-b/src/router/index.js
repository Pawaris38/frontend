import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Shop from '../views/Shop.vue';
import Checkout from '../views/Checkout.vue';
import Cart from '../views/Cart.vue'
const routes = [
  { path: '/', component: Login, name: 'login' },
  { path: '/shop', component: Shop, name: 'shop',  
    meta: { requiresAuth: true }
  },
  { 
    path: '/checkout', 
    component: Checkout, 
    name: 'checkout',
    props: route => ({ cart: route.params.cart, currency: route.params.currency }) 
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,  
    meta: { requiresAuth: true },
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('user'); 
    if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
      next({ name: 'login' }); 
    } else {
      next(); 
    }
  });
  

export default router;
