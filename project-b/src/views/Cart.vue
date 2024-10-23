<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-900">
        Shopping Cart
      </h1>
      <div v-if="cartItems.length === 0" class="text-center text-gray-600">
        Your cart is empty.
      </div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-md p-4"
          >
            <img
              :src="item.image"
              alt="Product Image"
              class="w-full h-48 object-cover mb-4"
            />
            <h3 class="text-lg font-bold">{{ item.name }}</h3>
            <p class="text-gray-600">Price: {{ item.price }} THB</p>
            <p>Quantity: {{ item.quantity }}</p>
            <div class="flex items-center mt-4">
              <button
                class="bg-gray-300 text-gray-700 py-1 px-2 rounded-l-md hover:bg-gray-400 transition duration-200"
                @click="decreaseQuantity(item)"
              >
                -
              </button>
              <span class="px-4">{{ item.quantity }}</span>
              <button
                class="bg-gray-300 text-gray-700 py-1 px-2 rounded-r-md hover:bg-gray-400 transition duration-200"
                @click="increaseQuantity(item)"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div class="mt-6 text-right">
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            @click="checkout"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Payment</h2>
        <p class="mb-2">
          Total Amount:
          <span class="font-bold"
            >{{ totalAmountInSelectedCurrency }} {{ currency }}</span
          >
        </p>
        <p class="mb-2">
          Your Balance:
          <span class="font-bold">{{ balance }} THB </span>
        </p>
        <label class="block mb-2">Currency:</label>
        <select
          v-model="currency"
          class="border border-gray-300 rounded-md p-2 w-full mb-4"
        >
          <option value="THB">THB</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
          <option value="SGD">SGD</option>
          <option value="CNY">CNY</option>
          <option value="HKD">HKD</option>
        </select>

        <button
          class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mr-2"
          @click="submitPayment"
        >
          Submit Payment
        </button>
        <button
          class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          @click="showPaymentModal = false"
        >
          Cancel
        </button>
      </div>
    </div>

    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg text-center">
        <h2 class="text-xl font-bold mb-4">Payment Successful</h2>
        <p>ชำระเงินเรียบร้อย</p>
        <button
          class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-4"
          @click="goToShop"
        >
          Go to Shop
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CartStore from "@/store/CartStore";
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      showPaymentModal: false,
      showSuccessModal: false,
      currency: "THB",
      balance: 0,
      exchangeRates: {
        THB: 1.0, // Thai Baht
        USD: 34.5, // US Dollar
        EUR: 38.2, // Euro
        JPY: 0.22, // Japanese Yen
        GBP: 44.7, // British Pound
        AUD: 22.5, // Australian Dollar
        CAD: 25.3, // Canadian Dollar
        SGD: 25.1, // Singapore Dollar
        CNY: 4.8, // Chinese Yuan
        HKD: 4.4, // Hong Kong Dollar
      },
    };
  },
  mounted() {
    const token = localStorage.getItem("user");

    axios
      .get("http://localhost:3001/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        this.balance = response.data.balance; // Store balance in the state
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
        const toast = useToast();
        toast.error("Unable to fetch balance", { icon: "❌" });
      });
  },
  computed: {
    cartItems() {
      return CartStore.state.cartItems;
    },
    totalAmount() {
      return this.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    totalAmountInSelectedCurrency() {
      return (this.totalAmount / this.exchangeRates[this.currency]).toFixed(2);
    },
  },
  methods: {
    increaseQuantity(item) {
      CartStore.addToCart(item);
    },
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        CartStore.removeFromCart(item.id, 1);
      } else {
        const confirmDelete = confirm(
          "Do you want to remove this item from your cart?"
        );
        if (confirmDelete) {
          CartStore.removeFromCart(item.id);
        }
      }
    },
    checkout() {
      this.showPaymentModal = true;
    },
    async submitPayment() {
      const paymentDto = {
        amount: this.totalAmountInSelectedCurrency,
        currency: this.currency,
      };
      const token = localStorage.getItem("user");

      try {
        const response = await axios.post(
          "http://localhost:3001/payment",
          paymentDto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Payment successful:", response.data);
        this.showPaymentModal = false;
        this.showSuccessModal = true;
        CartStore.clearCart();
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Payment failed:", errorMessage);
        const toast = useToast();
        toast.error(`Payment failed: ${errorMessage}`, {
          icon: "❌",
        });
      }
    },
    goToShop() {
      this.showSuccessModal = false;
      this.$router.push("/shop");
    },
  },
};
</script>

<style scoped>
.fixed {
  position: fixed;
}
</style>
