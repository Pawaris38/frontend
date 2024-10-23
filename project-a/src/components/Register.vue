<template>
  <div class="bg-white p-8 rounded shadow-md w-96">
    <h2 class="text-2xl mb-4 text-center">Register</h2>
    <form @submit.prevent="register">
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
        Register
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
    };
  },
  methods: {
    async register() {
      const toast = useToast();
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/register",
          {
            username: this.username,
            password: this.password,
          }
        );
        console.log("Registration successful:", response.data);
        this.$router.push({ name: "login" });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.error(
            "Username already exists. Please choose a different one."
          );
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    },
  },
};
</script>
