<template>
  <div id="app">
    <nav class="bg-gray-800 p-4 flex justify-between items-center">
      <div>
        <router-link to="/" class="text-white mx-2">Login</router-link>
        <router-link to="/register" class="text-white mx-2"
          >Register</router-link
        >
        <router-link to="/transaction" class="text-white mx-2"
          >Transaction</router-link
        >
      </div>
      <button
        v-if="isLoggedIn"
        @click="signOut"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const token = localStorage.getItem("token");
      this.isLoggedIn = !!token;
    },
    signOut() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.$router.push("/");
    },
  },
};
</script>

<style>
/* Add any styles you want here */
</style>
