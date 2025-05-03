<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
       <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4" @click.self="closeModal"> 
         <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
           <div v-if="isOpen" class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full max-w-lg overflow-hidden">
             <form @submit.prevent="handleCreateTournament">
               <div class="p-6 space-y-4">
                 <h3 class="text-xl font-semibold text-center text-[var(--color-myyellow)] font-['Jaro']">
                   Create New Tournament
                 </h3>
   
                  <!-- {/* Поля формы */} -->
                  <div>
                    <label for="tName" class="label-style">Name</label>
                    <input id="tName" v-model="tournamentData.name" type="text" required placeholder="Tournament Name" class="input-style">
                  </div>
                  <div>
                    <label for="tDesc" class="label-style">Description (Optional)</label>
                    <textarea id="tDesc" v-model="tournamentData.description" placeholder="Details about the tournament..." rows="3" class="input-style"></textarea>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label for="tSport" class="label-style">Sport</label>
                      <select id="tSport" v-model="tournamentData.sport_id" required class="select-style-modal">
                         <option value="" disabled>Select sport</option>
                         <!-- <option v-for="sport in sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option> -->
                      </select>
                      <p v-if="sportsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading...</p>
                    </div>
                     <div>
                      <label for="tFormat" class="label-style">Format</label>
                      <select id="tFormat" v-model="tournamentData.format_id" required class="select-style-modal">
                         <option value="" disabled>Select format</option>
                         <!-- {/* TODO: Загружать форматы с бэкенда */} -->
                         <option value="1">Single Elimination</option>
                         <option value="2">Round Robin</option>
                         <option value="3">Swiss</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                         <label for="tRegDate" class="label-style">Registration Ends</label>
                         <input id="tRegDate" v-model="tournamentData.reg_date" type="datetime-local" required class="input-style">
                     </div>
                     <div>
                         <label for="tStartDate" class="label-style">Start Date</label>
                         <input id="tStartDate" v-model="tournamentData.start_date" type="datetime-local" required class="input-style">
                     </div>
                      <div>
                         <label for="tEndDate" class="label-style">End Date</label>
                         <input id="tEndDate" v-model="tournamentData.end_date" type="datetime-local" required class="input-style">
                     </div>
                  </div>
                   <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label for="tLocation" class="label-style">Location (Optional)</label>
                        <input id="tLocation" v-model="tournamentData.location" type="text" placeholder="e.g., City Stadium or Online" class="input-style">
                     </div>
                      <div>
                        <label for="tMaxParticipants" class="label-style">Max Participants</label>
                        <input id="tMaxParticipants" v-model.number="tournamentData.max_participants" type="number" min="2" required placeholder="e.g., 16" class="input-style">
                     </div>
                  </div>
   
                  <!-- {/* Сообщения */} -->
                   <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2"> {{ errorMsg }} </div>
                   <div v-if="successMsg" class="text-green-500 text-sm text-center pt-2"> {{ successMsg }} </div>
   
               </div>
               <!-- {/* Футер модалки */} -->
               <div class="bg-[var(--color-secondary)] px-6 py-3 flex justify-end space-x-3">
                 <button type="button" @click="closeModal" :disabled="isLoading" class="px-4 py-2 text-sm font-medium rounded-md border border-gray-500 text-[var(--color-text-muted)] hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"> Cancel </button>
                 <button type="submit" :disabled="isLoading" class="px-4 py-2 text-sm font-medium rounded-md border border-transparent shadow-sm text-[var(--color-primary)] bg-[var(--color-myyellow)] hover:text-[var(--color-myred)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)] disabled:opacity-50">
                   <span v-if="!isLoading">Create Tournament</span>
                   <span v-else>Creating...</span>
                 </button>
               </div>
             </form>
           </div>
         </transition>
       </div>
     </transition>
   </template>
   
   <script setup>
   import { ref, reactive, watch, onMounted } from 'vue';
   import apiClient from '@/services/apiClient';
   
   const props = defineProps({ isOpen: { type: Boolean, required: true } });
   const emit = defineEmits(['close', 'tournamentCreated']);
   
   // Реактивный объект для данных формы
   const tournamentData = reactive({
     name: '',
     description: '',
     sport_id: '',
     format_id: '', // TODO: Заменить на реальные форматы
     reg_date: '',
     start_date: '',
     end_date: '',
     location: '',
     status: 'soon', // Статус по умолчанию при создании
     max_participants: '',
   });
   
   const sports = ref([]);
   const sportsLoading = ref(false);
   const isLoading = ref(false);
   const errorMsg = ref('');
   const successMsg = ref('');
   
   // Загрузка видов спорта
   const fetchSports = async () => { /* ... (такая же, как в CreateTeamModal) ... */ 
      sportsLoading.value = true; sports.value = [];
      try {
          const response = await apiClient.get('/sports');
          sports.value = response.data || [];
          if (!sports.value.some(s => s.id === 1 || s.name.toLowerCase() === 'football')) {
            sports.value.push({ id: 1, name: 'football' });
          }
      } catch (err) { console.error(err); } 
      finally { sportsLoading.value = false; }
   };
   
   // Сброс формы
   const resetForm = () => {
       Object.assign(tournamentData, { name: '', description: '', sport_id: '', format_id: '', reg_date: '', start_date: '', end_date: '', location: '', status: 'soon', max_participants: '' });
       errorMsg.value = '';
       successMsg.value = '';
       isLoading.value = false;
   };
   
   // Создание турнира
   const handleCreateTournament = async () => {
     isLoading.value = true; errorMsg.value = ''; successMsg.value = '';
     try {
       // Преобразование дат в формат ISO (YYYY-MM-DDTHH:mm:ssZ), если нужно
       const payload = {
         ...tournamentData,
         sport_id: parseInt(tournamentData.sport_id),
         format_id: parseInt(tournamentData.format_id),
         max_participants: parseInt(tournamentData.max_participants),
         // Убедитесь, что формат дат подходит для Go бэкенда (возможно, потребуется .toISOString())
         reg_date: tournamentData.reg_date ? new Date(tournamentData.reg_date).toISOString() : null,
         start_date: tournamentData.start_date ? new Date(tournamentData.start_date).toISOString() : null,
         end_date: tournamentData.end_date ? new Date(tournamentData.end_date).toISOString() : null,
       };
        // Удаляем пустые необязательные поля, если бэкенд не принимает null/""
        if (!payload.description) delete payload.description;
        if (!payload.location) delete payload.location;
   
   
       // Отправляем запрос на POST /tournaments
       const response = await apiClient.post('/tournaments', payload);
       
       successMsg.value = `Tournament "${response.data.name}" created!`;
       emit('tournamentCreated', response.data); 
       setTimeout(closeModal, 1500); // Закрываем после успеха
   
     } catch (err) {
        console.error("Error creating tournament:", err);
        errorMsg.value = err.response?.data?.message || 'Failed to create tournament.';
     } finally {
       isLoading.value = false;
     }
   };
   
   // Закрытие
   const closeModal = () => {
     resetForm();
     emit('close');
   };
   
   // Загружаем дисциплины при открытии
   watch(() => props.isOpen, (newVal) => { if (newVal) fetchSports(); });
   onMounted(fetchSports); // И при монтировании
   
   </script>
   
   <style scoped>
   </style>