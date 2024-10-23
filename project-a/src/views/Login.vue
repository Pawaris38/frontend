<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginComponent />
    </div>
  </template>
  
  <script>
  import LoginComponent from '../components/Login.vue';
  
  export default {
    components: {
      LoginComponent,
    },
  };
  </script>
  