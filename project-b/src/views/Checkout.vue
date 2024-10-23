<template>
    <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-6">Checkout</h2>
  
      <!-- แสดงรายการสินค้าในตะกร้า -->
      <div v-for="item in cart" :key="item.id" class="mb-4 border-b pb-4">
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <p>{{ item.price }} {{ currency }}</p>
      </div>
  
      <!-- แสดงยอดรวมทั้งหมด -->
      <div class="mt-4">
        <p class="text-xl font-semibold">Total: {{ total }} {{ currency }}</p>
      </div>
  
      <!-- ปุ่มยืนยันการชำระเงิน -->
      <button @click="confirmPayment" class="w-full bg-blue-500 text-white p-3 mt-6 rounded">
        Confirm Payment
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      cart: Array,
      currency: String,
    },
    computed: {
      total() {
        return this.cart.reduce((sum, item) => sum + item.price, 0);
      },
    },
    methods: {
      confirmPayment() {
        alert(`Payment confirmed! Total: ${this.total} ${this.currency}`);
        this.$router.push({ name: 'shop' });
      },
    },
  };
  </script>
  