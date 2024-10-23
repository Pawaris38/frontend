<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <div
      v-for="product in products"
      :key="product.id"
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <img
        :src="product.image"
        alt="Product Image"
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <h3 class="text-lg font-bold mb-2">{{ product.name }}</h3>
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <p class="text-xl font-semibold text-blue-600 mb-2">
          {{ product.price }} {{ currency }}
        </p>
        <button
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          @click="addToCart(product)"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CartStore from "@/store/CartStore";
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      currency: "THB",
    };
  },
  async created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3001/products");
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    addToCart(product) {
      CartStore.addToCart(product);
      const toast = useToast();
      toast.success(`${product.name} has been added to your cart!`, {
        icon: "✅",
      });
    },
  },
};
</script>
