<template>
    <div class="container poppins mx-auto py-10 text-center">
      <h1 class="text-3xl font-bold mb-4">Accept Team Invitation</h1>
      <div v-if="isLoading">Processing invitation...</div>
      <div v-if="errorMsg" class="text-red-500 mt-4">Error: {{ errorMsg }}</div>
      <div v-if="successMsg" class="text-green-500 mt-4">{{ successMsg }}</div>
      <div v-if="!isLoading && !errorMsg && !successMsg" class="mt-4">
        <p>Checking invitation details...</p>
      </div>
       <router-link v-if="!isLoading" to="/profile" class="mt-6 inline-block text-[var(--color-myyellow)] hover:underline">
         Back to Profile
       </router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/services/apiClient';
  import { useAuthStore } from '@/stores/authStore';
  
  const props = defineProps({
    inviteToken: { // Получаем токен из URL через props: true в роутере
      type: String,
      required: true
    }
  });
  
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  
  const isLoading = ref(false);
  const errorMsg = ref('');
  const successMsg = ref('');
  
  const acceptInvite = async () => {
    isLoading.value = true;
    errorMsg.value = '';
    successMsg.value = '';
  
    try {
      // Теперь мы делаем ЗАЩИЩЕННЫЙ API запрос с фронтенда
      // Бэкенд должен иметь эндпоинт для принятия инвайта, например POST /invites/accept
      // Передаем токен приглашения в теле запроса
      // Наш apiClient автоматически добавит Authorization: Bearer {JWT} залогиненного пользователя
  
      // --- ВАЖНО: Нужен новый эндпоинт на бэке! ---
      // Например: const response = await apiClient.post('/invites/accept', { token: props.inviteToken });
      // ИЛИ если использовать токен в URL:
      const response = await apiClient.post(`/invites/join/${props.inviteToken}`); // Отправляем POST на бэк эндпоинт, который определил ваш тиммейт
  
      // Обрабатываем успешный ответ
      successMsg.value = response.data?.message || 'Successfully joined team!'; 
  
      // Обновляем данные пользователя в store, чтобы получить новый team_id/team
      if(authStore.userId) {
        await authStore.fetchUser(authStore.userId);
      }
  
      // Опционально: редирект через пару секунд
      setTimeout(() => router.push('/profile'), 2000);
  
    } catch (err) {
      console.error("Error accepting invite:", err);
      errorMsg.value = err.response?.data?.message || 'Failed to accept invitation.';
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(() => {
    if (props.inviteToken) {
      acceptInvite(); // Вызываем принятие инвайта при загрузке страницы
    } else {
       errorMsg.value = 'Invalid invitation link.';
    }
  });
  </script>