<template>
  <div class="bg-white p-8 rounded shadow-md w-96">
    <h2 class="text-2xl mb-4 text-center">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block text-gray-700">Username</label>
        <input
          type="text"
          v-model="username"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Password</label>
        <input
          type="password"
          v-model="password"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
          required
        />
      </div>
      <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">
        Login
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification"; 

export default {
  data() {
    return {
      username: "",
      password: "",
      token: null,
    };
  },
  setup() {
    const toast = useToast(); 
    return { toast };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:3000/auth/login", {
          username: this.username,
          password: this.password,
        });
        console.log("Login successful:", response.data);
        this.token = response.data.access_token;
        localStorage.setItem("token", this.token);
        this.$router.push({ name: "transaction" });
      } catch (error) {
        this.toast.error("Invalid username or password"); 
      }
    },
  },
};
</script>
