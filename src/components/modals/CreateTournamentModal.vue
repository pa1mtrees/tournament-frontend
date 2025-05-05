<template>
  <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
     <div v-if="isOpen" class="fixed inset-0 bg-secondary/90 bg-opacity-70 z-40 flex items-center justify-center p-4" @click.self="closeModal"> 
       <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
         <div v-if="isOpen" class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full max-w-lg overflow-hidden">
           <form @submit.prevent="handleCreateTournament">
             <div class="p-6 space-y-4">
               <h3 class="text-3xl text-center text-[var(--color-text-light)] font-['Jaro']">
                 Create New Tournament
               </h3>
 
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
                       <option v-for="sport in metaStore.sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
                    </select>
                    <p v-if="metaStore.sportsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading...</p>
                    <p v-if="metaStore.sportsError" class="text-xs text-red-500 mt-1">{{ metaStore.sportsError }}</p>
                  </div>
                   <div>
                    <label for="tFormat" class="label-style">Format</label>
                    <select id="tFormat" v-model="tournamentData.format_id" required class="select-style-modal">
                       <option value="" disabled>Select format</option>
                       {/* TODO: Заменить на metaStore.formats */}
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
 
                 <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2"> {{ errorMsg }} </div>
                 <div v-if="successMsg" class="text-green-500 text-sm text-center pt-2"> {{ successMsg }} </div>
 
             </div>
             <div class="bg-[var(--color-primary)] px-6 py-3 flex justify-end space-x-3">
               <button type="button" @click="closeModal" :disabled="isLoading" class="px-4 py-2 text-sm font-medium rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"> Cancel </button>
               <button type="submit" :disabled="isLoading" class="px-4 py-2 text-sm font-medium rounded-md border border-transparent shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)] disabled:opacity-50">
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
 import { ref, reactive, watch } from 'vue'; // Убрали onMounted, если не нужен
 import apiClient from '@/services/apiClient';
 import { useMetaStore } from '@/stores/metaStore'; // Используем metaStore

 const props = defineProps({ isOpen: { type: Boolean, required: true } });
 const emit = defineEmits(['close', 'tournamentCreated']);
 const metaStore = useMetaStore(); // Инициализируем store
 
 const tournamentData = reactive({
   name: '',
   description: '',
   sport_id: '',
   format_id: '', // TODO: Заменить на реальные форматы
   reg_date: '',
   start_date: '',
   end_date: '',
   location: '',
   max_participants: '',
 });
 
 // Убираем локальное состояние для спортов
 // const sports = ref([]);
 // const sportsLoading = ref(false);
 
 const isLoading = ref(false);
 const errorMsg = ref('');
 const successMsg = ref('');
 
 // Убираем локальную функцию fetchSports
 // const fetchSports = async () => { ... };
 
 const resetForm = () => {
     Object.assign(tournamentData, { name: '', description: '', sport_id: '', format_id: '', reg_date: '', start_date: '', end_date: '', location: '', max_participants: '' });
     errorMsg.value = '';
     successMsg.value = '';
     isLoading.value = false;
 };
 
 const handleCreateTournament = async () => {
   isLoading.value = true; errorMsg.value = ''; successMsg.value = '';
   try {
    // --- ИЗМЕНЕНИЕ ЗДЕСЬ: Собираем payload без status ---
    const payload = {
      name: tournamentData.name,
      sport_id: parseInt(tournamentData.sport_id),
      format_id: parseInt(tournamentData.format_id), 
      max_participants: parseInt(tournamentData.max_participants),
      reg_date: tournamentData.reg_date ? new Date(tournamentData.reg_date).toISOString() : null,
      start_date: tournamentData.start_date ? new Date(tournamentData.start_date).toISOString() : null,
      end_date: tournamentData.end_date ? new Date(tournamentData.end_date).toISOString() : null,
      // Не включаем status
    };
     // Добавляем необязательные поля, только если они не пустые
     if (tournamentData.description) payload.description = tournamentData.description;
     if (tournamentData.location) payload.location = tournamentData.location;
     // ------------------------------------------------------
     console.log("Sending payload to POST /tournaments:", payload); // Лог для отладки

     const response = await apiClient.post('/tournaments', payload);
     
     successMsg.value = `Tournament "${response.data?.tournament?.name || 'New'}" created!`; // Адаптируем под возможный ответ
     emit('tournamentCreated', response.data?.tournament || response.data); // Отправляем данные турнира
     setTimeout(closeModal, 1500); 
 
   } catch (err) {
      console.error("Error creating tournament:", err);
      errorMsg.value = err.response?.data?.message || err.response?.data?.error || 'Failed to create tournament.'; // Пробуем и error поле
    } finally {
     isLoading.value = false;
   }
 };
 
 const closeModal = () => {
   resetForm();
   emit('close');
 };
 
 // Загружаем спорты из store при открытии, если они еще не загружены
 watch(() => props.isOpen, (newVal) => { 
     if (newVal && metaStore.sports.length === 0) {
         metaStore.fetchSports(); 
     } 
 });
 
 // Убираем onMounted для fetchSports здесь
 // onMounted(fetchSports);
 
 </script>
 
 <style scoped>

 </style>