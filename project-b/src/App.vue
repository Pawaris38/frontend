<template>
  <div id="app">
    <nav class="bg-gray-800 p-4 flex justify-between">
      <div>
        <router-link to="/" class="text-white mx-2">Login</router-link>
        <router-link to="/shop" class="text-white mx-2">Shop</router-link>
        <router-link to="/cart" class="text-white mx-2 relative"
          >Cart
          <span
            v-if="cartItemCount > 0"
            class="absolute -top-1 -right-5 bg-red-500 text-white rounded-full px-2 text-xs"
          >
            {{ cartItemCount }}
          </span>
        </router-link>
      </div>
      <div>
        <button
          v-if="isLoggedIn"
          @click="signOut"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import CartStore from "./store/CartStore"; 
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  computed: {
    cartItemCount() {
      return CartStore.getCartItemCount(); 
    },
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const user = localStorage.getItem("user");
      if (user) {
        this.isLoggedIn = true;
      }
    },
    signOut() {
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
</style>
