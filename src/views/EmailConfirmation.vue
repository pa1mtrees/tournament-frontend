<template>
  <div class="email-confirmation-container">
    <div v-if="isLoading" class="loading-message">
      <p>Confirming your email, please wait...</p>
    </div>
    <div v-else-if="confirmationStatus === 'success'" class="success-message">
      <h1 class="text-2xl">Email Confirmed!</h1>
      <p>Your email address has been successfully confirmed.</p>
      <p>You can now proceed to log in or use the application.</p>
      <router-link to="/login">Go to Login</router-link>
    </div>
    <div v-else-if="confirmationStatus === 'error'" class="error-message">
      <h1 class="text-2xl">Confirmation Failed</h1>
      <p>{{ errorMessage || "There was an error confirming your email. Please try again or contact support." }}</p>
    </div>
    <div v-else-if="confirmationStatus === 'invalid_token'" class="error-message">
      <h1>Invalid or Expired Token</h1>
      <p>The confirmation link is invalid or has expired. Please request a new confirmation email.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoading = ref(true);
const confirmationStatus = ref('');
const errorMessage = ref('');

onMounted(async () => {
  const token = route.query.token;

  if (!token) {
    confirmationStatus.value = 'error';
    errorMessage.value = 'No confirmation token found in the URL.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/confirm-email?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      confirmationStatus.value = 'success';
    } else {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
      if (response.status === 400 || response.status === 404) {
        confirmationStatus.value = 'invalid_token';
        errorMessage.value = errorData.message || 'The confirmation link is invalid or has expired.';
      } else {
        confirmationStatus.value = 'error';
        errorMessage.value = errorData.message || `Failed to confirm email. Status: ${response.status}`;
      }
    }
  } catch (error) {
    confirmationStatus.value = 'error';
    errorMessage.value = 'An unexpected error occurred while trying to confirm your email. Please check your network connection and try again.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.email-confirmation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading-message,
.success-message,
.error-message {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.loading-message p {
  font-size: 1.2em;
  color: #333;
}

.success-message {
  background-color: #e6fffa;
  border: 1px solid #228651;
  color: #20392d;
}

.success-message h1 {
  color: #2f855a;
  margin-bottom: 10px;
}

.error-message {
  background-color: #fff5f5;
  border: 1px solid #e53e3e;
  color: #c53030;
}

.error-message h1 {
  color: #c53030;
  margin-bottom: 10px;
}

p {
  font-size: 1em;
  line-height: 1.6;
  margin-bottom: 15px;
}

a {
  color: #3182ce;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
