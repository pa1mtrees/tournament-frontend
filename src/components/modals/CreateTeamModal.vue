<template>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 bg-secondary/90 z-40 flex items-center justify-center p-4" @click.self="closeModal"> 
  
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div v-if="isOpen" class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 space-y-4">
              <h3 class="text-xl font-semibold text-center text-[var(--color-myyellow)] font-['Jaro']">
                Create New Team
              </h3>
  
              <form @submit.prevent="handleCreateTeam">
                <div class="space-y-4">
                  <div>
                    <label for="teamName" class="block text-sm font-medium text-[var(--color-text-muted)]">Team Name</label>
                    <input 
                      id="teamName" 
                      v-model="teamName" 
                      type="text" 
                      required 
                      placeholder="Enter team name"
                      class="mt-1 appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
                    />
                  </div>
  
                  <div>
                    <label for="discipline" class="block text-sm font-medium text-[var(--color-text-muted)]">Discipline</label>
                    <select 
                      id="discipline" 
                      v-model="selectedSportId" 
                      required
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[var(--color-secondary)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm rounded-md bg-[var(--color-secondary)] text-[var(--color-text-light)]"
                    >
                      <option value="" disabled>Select discipline</option>
                      <option v-for="sport in sports" :key="sport.id" :value="sport.id">
                        {{ sport.name }}
                      </option>
                    </select>
                    <p v-if="sportsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading disciplines...</p>
                    <p v-if="sportsError" class="text-xs text-red-500 mt-1">{{ sportsError }}</p>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-[var(--color-text-muted)]">Team Logo (Optional)</label>
                    <div class="mt-1 p-4 text-center border-2 border-dashed border-[var(--color-secondary)] rounded-md text-[var(--color-text-muted)]">
                      Logo upload coming soon...
                    </div>
                  </div>
  
                   <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2">
                      {{ errorMsg }}
                   </div>
                   <div v-if="successMsg" class="text-green-500 text-sm text-center pt-2">
                      {{ successMsg }}
                   </div>
  
                  <div class="flex justify-end space-x-3 pt-2">
                     <button 
                        type="button" 
                        @click="closeModal"
                        :disabled="isLoading"
                        class="px-4 py-2 text-sm font-medium rounded-md border border-gray-500 text-[var(--color-text-muted)] hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                      >
                        Cancel
                     </button>
                     <button 
                        type="submit"
                        :disabled="isLoading || !teamName || !selectedSportId"
                        class="px-4 py-2 text-sm font-medium rounded-md border border-transparent shadow-sm text-[var(--color-primary)] bg-[var(--color-myyellow)] hover:text-[var(--color-myred)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)] disabled:opacity-50"
                     >
                        <span v-if="!isLoading">Create Team</span>
                        <span v-else>Creating...</span>
                     </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import apiClient from '@/services/apiClient';
  
  // Props для управления видимостью
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    }
  });
  
  // Emits для закрытия и уведомления о создании
  const emit = defineEmits(['close', 'teamCreated']);
  
  const teamName = ref('');
  const selectedSportId = ref('');
  const sports = ref([]); // Список дисциплин
  const sportsLoading = ref(false);
  const sportsError = ref('');
  
  const isLoading = ref(false);
  const errorMsg = ref('');
  const successMsg = ref('');
  
  // Функция загрузки дисциплин
  const fetchSports = async () => {
    sportsLoading.value = true;
    sportsError.value = '';
    sports.value = [];
    try {
      const response = await apiClient.get('/sports');
      // Ожидаем массив [{ id: 1, name: 'football' }]
      sports.value = response.data || []; 
    } catch (err) {
      console.error("Error fetching sports:", err);
      sportsError.value = 'Failed to load disciplines.';
    } finally {
      sportsLoading.value = false;
    }
  };
  
  // Функция создания команды
  const handleCreateTeam = async () => {
    isLoading.value = true;
    errorMsg.value = '';
    successMsg.value = '';
    try {
      // Отправляем запрос на POST /teams
      // Убедитесь, что бэкенд ожидает { "name": "...", "sport_id": ... }
      const response = await apiClient.post('/teams', {
        name: teamName.value,
        sport_id: parseInt(selectedSportId.value) // Убедимся, что ID - число
      });
  
      // Успех
      successMsg.value = `Team "${response.data.name}" created successfully!`;
      emit('teamCreated', response.data); // Отправляем событие с созданной командой
  
      // Закрываем модалку через небольшую задержку
      setTimeout(() => {
          closeModal();
      }, 1500);
  
    } catch (err) {
       console.error("Error creating team:", err);
       errorMsg.value = err.response?.data?.message || 'Failed to create team.';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Закрытие модального окна
  const closeModal = () => {
    // Сбрасываем состояние формы перед закрытием
    teamName.value = '';
    selectedSportId.value = '';
    errorMsg.value = '';
    successMsg.value = '';
    isLoading.value = false;
    // Отправляем событие наверх
    emit('close');
  };
  
  // Загружаем дисциплины, когда модальное окно открывается
  watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      fetchSports();
    }
  });
  
  // Загружаем дисциплины один раз при монтировании (на всякий случай)
  onMounted(fetchSports);
  
  </script>