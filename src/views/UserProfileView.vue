<template>
    <div class="space-y-8">
      
      <div v-if="isLoading" class="text-center py-10 text-[var(--color-text-muted)]">
        Loading profile...
      </div>
  
      <div v-else-if="errorMsg" class="text-center py-10 text-red-500">
        Error: {{ errorMsg }}
      </div>
  
      <template v-else-if="userProfileData">
        <h1 class="text-4xl font-['Jaro'] text-[var(--color-myyellow)]">
          {{ userProfileData.first_name }} {{ userProfileData.last_name }}'s Profile 
        </h1>
  
        <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          
          <div class="flex-shrink-0">
            <img 
              v-if="userProfileData.avatarUrl" 
              :src="userProfileData.avatarUrl" 
              alt="User Avatar" 
              class="w-24 h-24 rounded-full border-4 border-[var(--color-myyellow)]" 
            />
             <img 
              v-else-if="userProfileData.username"
              :src="`https://api.dicebear.com/8.x/identicon/svg?seed=${userProfileData.username}`"
              alt="User Avatar" 
              class="w-24 h-24 rounded-full border-4 border-[var(--color-myyellow)]" 
              />
             <div v-else class="w-24 h-24 rounded-full bg-[var(--color-secondary)] border-4 border-[var(--color-myyellow)] flex items-center justify-center text-4xl text-[var(--color-text-light)] font-bold">
                ?
              </div>
          </div>
  
          <div class="text-center sm:text-left flex-grow">
            <h2 class="text-2xl font-semibold text-[var(--color-text-light)]">
              {{ userProfileData.first_name }} {{ userProfileData.last_name }}
            </h2>
            <p class="text-sm text-[var(--color-text-muted)]">{{ userProfileData.email }}</p>
            <p v-if="userProfileData.role" class="text-sm text-[var(--color-text-muted)] capitalize mt-1">
              Role: {{ userProfileData.role }}
            </p>
            <p v-if="userProfileData.created_at" class="text-xs text-[var(--color-text-muted)] mt-2">
              Joined: {{ formattedJoinDate }}
            </p>
          </div>
  
          <div v-if="isOwnProfile" class="sm:ml-auto flex-shrink-0">
            <router-link 
              to="/settings" 
              class="inline-block bg-[var(--color-myyellow)] text-[var(--color-primary)] px-5 py-2 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-medium"
            >
              Edit Profile
            </router-link>
          </div>
        </div>
  
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-semibold text-[var(--color-text-light)] mb-4">User's Tournaments</h3>
            <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]">
              (Coming Soon)
            </div>
          </div>
          <div>
            <h3 class="text-2xl font-semibold text-[var(--color-text-light)] mb-4">User's Match History</h3>
            <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]">
              (Coming Soon)
            </div>
          </div>
        </div>
  
      </template>
       <div v-else class="text-center py-10 text-[var(--color-text-muted)]">
         User not found.
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import { useRoute, RouterLink } from 'vue-router'; // Импортируем useRoute
  import { useAuthStore } from '@/stores/authStore'; // Импортируем authStore для сравнения ID
  import apiClient from '@/services/apiClient'; // Импортируем apiClient
  
  const route = useRoute();
  const authStore = useAuthStore();
  
  const userProfileData = ref(null);
  const isLoading = ref(false);
  const errorMsg = ref('');
  
  // Вычисляемое свойство, чтобы проверить, смотрит ли пользователь свой собственный профиль
  const isOwnProfile = computed(() => {
    return authStore.isAuthenticated && userProfileData.value && authStore.userId === userProfileData.value.id;
  });
  
  // Функция загрузки данных профиля
  const fetchUserProfile = async (userId) => {
    isLoading.value = true;
    errorMsg.value = '';
    userProfileData.value = null; // Сбрасываем перед загрузкой
  
    // Проверяем, что userId валидный (не undefined, не null и т.д.)
    if (!userId) {
       errorMsg.value = 'Invalid User ID.';
       isLoading.value = false;
       return;
    }
  
    try {
      const response = await apiClient.get(`/users/${userId}`);
      userProfileData.value = response.data; // Сохраняем полученные данные
    } catch (err) {
      console.error("Error fetching user profile:", err);
      errorMsg.value = err.response?.data?.message || 'Failed to load profile.';
      if (err.response?.status === 404) {
          errorMsg.value = 'User not found.';
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // Форматирование даты (как в ProfileView)
  const formattedJoinDate = computed(() => {
    if (!userProfileData.value?.created_at) {
      return '';
    }
    try {
      return new Date(userProfileData.value.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return userProfileData.value.created_at; 
    }
  });
  
  // Следим за изменением параметра :id в маршруте
  // и перезагружаем данные при его изменении
  watch(
    () => route.params.id, // Источник наблюдения
    (newId, oldId) => {
      if (newId && newId !== oldId) { // Загружаем, если ID изменился и он не пустой
        fetchUserProfile(newId);
      }
    },
    { immediate: true } // Выполнить fetchUserProfile сразу при монтировании компонента
  );
  
  // Также можно использовать onMounted, если не ожидается навигация между профилями без перезагрузки страницы
  // onMounted(() => {
  //   fetchUserProfile(route.params.id);
  // });
  
  </script>
  
  <style scoped>
  /* Стили для страницы профиля пользователя */
  </style>