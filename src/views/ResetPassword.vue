<template>
  <div class="reset-password-container">
    <div v-if="isLoading" class="loading-message">
      <p>Resetting your password, please wait...</p>
    </div>
    <div v-else-if="resetStatus === 'success'" class="success-message">
      <h1 class="text-2xl">Password Reset Successful!</h1>
      <p>Your password has been updated. You can now <router-link to="/login">log in</router-link> with your new password.</p>
    </div>
    <div v-else>
      <h1 class="text-2xl mb-4">Reset Password</h1>
      <form @submit.prevent="handleReset">
        <div class="mb-4">
          <label for="password" class="block mb-1">New Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="w-full px-3 py-2 border rounded"
            placeholder="Enter new password"
          />
        </div>
        <div v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</div>
        <button
          type="submit"
          :disabled="isLoading"
          class="bg-myred text-white px-4 py-2 rounded"
        >
          <span v-if="!isLoading">Reset Password</span>
          <span v-else>Resetting...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const password = ref('');
const isLoading = ref(false);
const resetStatus = ref('');
const errorMessage = ref('');
const token = route.query.token;

const handleReset = async () => {
  errorMessage.value = '';
  if (!password.value) {
    errorMessage.value = 'Please enter a new password.';
    return;
  }
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:8080/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: password.value }),
    });
    if (response.ok) {
      resetStatus.value = 'success';
    } else {
      const data = await response.json().catch(() => ({}));
      errorMessage.value = data.message || 'Failed to reset password.';
    }
  } catch (e) {
    errorMessage.value = 'Network error. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 32px;
  background: var(--color-primary, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
}
input {
  border: 1px solid #ccc;
}
.success-message {
  color: #228651;
}
.loading-message {
  color: #555;
}
</style>
