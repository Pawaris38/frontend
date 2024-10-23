<template>
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-center mb-8 text-gray-900">Shop</h1>
        <ProductList />
      </div>
    </div>
  </template>
  
  <script>
  import ProductList from "@/components/ProductList.vue";
  
  export default {
    components: {
      ProductList,
    },
  };
  </script>
  