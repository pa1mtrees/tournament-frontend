<template>
  <div class="relative lg:grid lg:grid-cols-2 items-center">

    <div class="block md:block lg:hidden absolute inset-0 z-0">
      <img
        src="/src/assets/logback2.svg"
        alt=""
        aria-hidden="true"
        class="w-full h-full object-cover"
        />
    </div>

    <div class="relative z-10 flex justify-center lg:justify-end items-center py-12 px-4 sm:min-h-[calc(100vh-150px)] lg:min-h-0">
      <div class="w-full max-w-md p-8 space-y-6 bg-[var(--color-primary)] rounded-[1vw] shadow-lg">
        <h2 class="text-center text-4xl text-[var(--color-text-light)] font-['Jaro']">
          Sign In
        </h2>
        <form class="space-y-6" @submit.prevent="handleLogin">

          <div>
            <label for="email" class="block text-sm font-medium text-[var(--color-text-muted)]">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                v-model="email"
                autocomplete="email"
                required
                placeholder="Enter your email"
                class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-[var(--color-text-muted)]">
              Password
            </label>

            <div class="mt-1">
              <input data-popover-target="popover-password" data-popover-placement="bottom"
                id="password"
                name="password"
                type="password"
                v-model="password"
                required
                placeholder="Enter your password"
                class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
              >
            </div>
          </div>

          <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2">
             {{ errorMsg }}
          </div>

          <div class="flex justify-between">
            <a class="flex poppins justify-center items-center cursor-pointer" @click="showForgotModal = true">Forgot Password?</a>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex justify-center py-2 px-4 border border-transparent rounded-[0.7vw] shadow-sm text-lg font-medium text-[var(--color-text-light)] bg-[var(--color-myred)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myred)] transition-colors disabled:opacity-50"
            >
              <span v-if="!isLoading">Sign In</span>
              <span v-else>Loading...</span>
            </button>
          </div>
          <div v-if="showForgotModal" class="fixed inset-0 flex items-center justify-center bg-secondary/90 z-50">
            <div class="bg-primary rounded-lg p-6 w-full max-w-sm shadow-lg">
              <h2 class="text-xl font-bold mb-4 text-center">Forgot Password</h2>
              <input
                v-model="forgotEmail"
                type="email"
                placeholder="Enter your email"
                class="w-full border px-3 py-2 rounded mb-3"
              />
              <div v-if="forgotError" class="text-red-500 text-sm mb-2 text-center">{{ forgotError }}</div>
              <div v-if="forgotSuccess" class="text-green-600 text-sm mb-2 text-center">{{ forgotSuccess }}</div>
              <div class="flex justify-between">
                <button @click="closeForgotModal" class="ml-2 px-4 py-2 rounded border">Cancel</button>
                <button @click="handleForgotPassword" :disabled="forgotLoading" class="bg-[var(--color-myred)] text-white px-4 py-2 rounded">
                  <span v-if="!forgotLoading">Send</span>
                  <span v-else>Sending...</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <p class="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Do not have an account?
          <router-link
            to="/signup"
            class="font-medium text-[var(--color-myred)]"
          >
            Sign Up
          </router-link>
        </p>
      </div>
    </div>

    <div class="hidden lg:block h-full lg:col-span-1">
      <img
        src="/src/assets/logback2.svg"
        alt="Decorative graphic"
        class="w-full h-full object-fill lg:object-cover min-h-[calc(100vh-150px)] overflow-visible md:animate-pulse"
        />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const showForgotModal = ref(false);
const forgotEmail = ref('');
const forgotError = ref('');
const forgotSuccess = ref('');
const forgotLoading = ref(false);

const closeForgotModal = () => {
  showForgotModal.value = false;
  forgotEmail.value = '';
  forgotError.value = '';
  forgotSuccess.value = '';
};

const handleForgotPassword = async () => {
  forgotError.value = '';
  forgotSuccess.value = '';
  forgotLoading.value = true;
  try {
    const response = await fetch('http://localhost:8080/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail.value }),
    });
    if (response.ok) {
      forgotSuccess.value = 'If this email exists, a reset link has been sent.';
    } else {
      const data = await response.json().catch(() => ({}));
      forgotError.value = data.message || 'Failed to send reset email.';
    }
  } catch (e) {
    forgotError.value = 'Network error. Please try again.';
  } finally {
    forgotLoading.value = false;
  }
};

const handleLogin = async () => {
  errorMsg.value = '';
  isLoading.value = true;
  const result = await authStore.login({
    email: email.value,
    password: password.value
  });
  isLoading.value = false;
  if (!result.success) {
    errorMsg.value = result.message || 'Failed to log in.';
  }
};
</script>

<style scoped>
</style>
