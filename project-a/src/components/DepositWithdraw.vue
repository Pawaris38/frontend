<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      <h2 class="text-3xl font-bold mb-6 text-center">Deposit / Withdraw</h2>
      <div class="mb-4 text-center">
        <p class="font-semibold text-lg">Account Name: {{ userName }}</p>
        <p class="font-semibold text-lg">Current Balance: {{ userBalance }} THB</p>
      </div>
      <select v-model="currency" class="mb-4 p-3 border border-gray-300 rounded w-full text-lg">
        <option v-for="(rate, currencyCode) in exchangeRates" :key="currencyCode" :value="currencyCode">
          {{ currencyCode }}
        </option>
      </select>
      <div class="mb-4">
        <label class="block text-gray-700 text-lg font-semibold">Amount</label>
        <input
          type="number"
          v-model="amount"
          class="mt-1 p-3 w-full border border-gray-300 rounded"
          required
          @input="updateConvertedBalance"
        />
      </div>
      <div class="mb-4 text-gray-600">
        <p class="text-lg">Balance After Exchange Rate: <strong>{{ calculatedBalance }} THB</strong></p>
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-semibold">Exchange Rates:</h3>
        <ul class="list-disc pl-6">
          <li v-for="(rate, currencyCode) in exchangeRates" :key="currencyCode">
            <span class="font-medium">{{ currencyCode }}:</span> {{ rate }}
          </li>
        </ul>
      </div>
      <div class="flex flex-col md:flex-row justify-between">
        <button
          @click.prevent="deposit"
          :disabled="!amount"
          class="bg-blue-600 text-white p-3 rounded mb-2 md:mb-0 transition duration-200 hover:bg-blue-700 flex-1 mr-2"
          :class="{ 'opacity-50 cursor-not-allowed': !amount }"
        >
          Deposit
        </button>
        <button
          @click.prevent="withdraw"
          :disabled="!amount"
          class="bg-red-600 text-white p-3 rounded transition duration-200 hover:bg-red-700 flex-1"
          :class="{ 'opacity-50 cursor-not-allowed': !amount }"
        >
          Withdraw
        </button>
      </div>
      <div class="mt-6 text-center">
        <p v-if="message" class="text-green-600 font-semibold">{{ message }}</p>
        <p v-if="error" class="text-red-600 font-semibold">{{ error }}</p>
      </div>
      <div class="mt-6">
        <h3 class="text-lg font-semibold text-center mb-4">Transaction History</h3>
        <ul class="border-t border-gray-300">
          <li
            v-for="transaction in transactions"
            :key="transaction.id"
            class="flex justify-between py-3 px-4 border-b border-gray-200"
          >
            <div>
              <span class="font-semibold">{{ transaction.type }}</span>: {{ transaction.amount }} {{ transaction.currency }}
            </div>
            <div class="text-gray-600">
              {{ formatDate(transaction.created_at) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { format } from "date-fns"; 
export default {
  data() {
    return {
      currency: "THB",
      amount: null,
      message: "",
      error: "",
      userBalance: "0.00",
      userName: "",
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
      transactions: [],
    };
  },
  computed: {
    calculatedBalance() {
      const rate = this.exchangeRates[this.currency];
      const amountValue = parseFloat(this.amount) || 0;
      const convertedAmount = amountValue * rate;

      const newBalance = convertedAmount;

      return newBalance.toFixed(2);
    },
  },
  async created() {
    await this.fetchUserData();
    await this.fetchTransactionHistory();
  },
  methods: {
    async fetchUserData() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.userBalance = response.data.balance;
        this.userName = response.data.username;
      } catch (error) {
        console.error(
          "Failed to fetch user data:",
          error.response?.data || error
        );
        this.error = "Failed to fetch user data.";
      }
    },
    async fetchTransactionHistory() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3000/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.transactions = response.data;
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
        this.error = "Failed to fetch transaction history.";
      }
    },
    formatDate(dateString) {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    },
    async deposit() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "http://localhost:3000/transactions/deposit",
          {
            currency: this.currency,
            amount: this.amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.message = "Deposit successful!";
        this.error = "";
        this.amount = null;
        await this.fetchUserData();
        await this.fetchTransactionHistory();
      } catch (error) {
        console.error("Deposit failed:", error.response.data);

        if (error.response.status === 429) {
          this.error =
            "Transaction Limit Reached: You have exceeded the maximum number of transactions allowed in a short period. Please try again later.";
        } else {
          this.error = "Deposit failed: " + error.response.data.message;
        }
        this.message = "";
      }
    },

    async withdraw() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "http://localhost:3000/transactions/withdraw",
          {
            currency: this.currency,
            amount: this.amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.message = "Withdraw successful!";
        this.error = "";
        this.amount = null;
        await this.fetchUserData();
        await this.fetchTransactionHistory();
      } catch (error) {
        console.error("Withdraw failed:", error.response.data);

        if (error.response.status === 429) {
          this.error =
            "Transaction Limit Reached: You have exceeded the maximum number of transactions allowed in a short period. Please try again later.";
        } else {
          this.error = "Withdraw failed: " + error.response.data.message;
        }
        this.message = "";
      }
    },
    updateConvertedBalance() {
      this.calculatedBalance;
    },
  },
};
</script>
