<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
       <div v-if="isOpen" class="poppins fixed inset-0 bg-gray-700/50 z-40 flex items-center justify-center p-4" @click.self="closeModal"> 
         <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
           
           <section v-if="isOpen" class="max-w-xl p-6 mx-auto bg-[var(--color-primary)] rounded-md shadow-xl w-full overflow-hidden">
               <h2 class="text-2xl text-[var(--color-myred)] capitalize font-['Jaro']">
                   Edit Team Details
               </h2>
   
               <form @submit.prevent="handleUpdateTeam">
                   <div class="grid grid-cols-1 gap-6 mt-4">
                       <div>
                           <label class="label-style" for="editTeamName">Team Name</label>
                           <input id="editTeamName" type="text" v-model.trim="formData.name" required class="input-style">
                       </div>
   
                       <div>
                           <label class="label-style" for="editTeamSport">Sport</label>
                           <select id="editTeamSport" v-model="formData.sport_id" required class="select-style-modal">
                              <option value="" disabled>Select sport</option>
                              <option v-for="sport in metaStore.sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
                           </select>
                           <p v-if="metaStore.sportsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading sports...</p>
                            <p v-if="metaStore.sportsError" class="text-xs text-red-500 mt-1">{{ metaStore.sportsError }}</p>
                       </div>
                      
                   </div>
   
                   <div v-if="errorMsg" class="text-red-500 text-sm text-center mt-4"> {{ errorMsg }} </div>
                   <div v-if="successMsg" class="text-green-500 text-sm text-center mt-4"> {{ successMsg }} </div>
   
                   <div class="flex justify-end mt-6 space-x-3">
                        <button 
                           type="button" 
                           @click="closeModal"
                           :disabled="isLoading"
                           class="px-6 py-2 text-sm rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                         >
                          Cancel
                       </button>
                       <button 
                           type="submit" 
                           :disabled="isLoading || !isChanged" 
                           class="px-6 py-2 text-sm font-medium text-[var(--color-text-light)] transform bg-[var(--color-myred)] rounded-md hover:bg-[var(--color-myreddarker)] focus:outline-none focus:bg-[var(--color-myyellow)] disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          <span v-if="!isLoading">Save Changes</span>
                          <span v-else>Saving...</span>
                       </button>
                   </div>
               </form>
           </section>
   
         </transition>
       </div>
     </transition>
   </template>
   
   <script setup>
   import { ref, reactive, watch, computed } from 'vue';
   import apiClient from '@/services/apiClient';
   import { useMetaStore } from '@/stores/metaStore';
   
   const props = defineProps({
     isOpen: { type: Boolean, required: true },
     currentTeam: { type: Object, default: () => ({}) } // Принимаем текущие данные команды
   });
   
   const emit = defineEmits(['close', 'teamUpdated']);
   const metaStore = useMetaStore();
   
   const formData = reactive({
     name: '',
     sport_id: '',
   });
   
   const isLoading = ref(false);
   const errorMsg = ref('');
   const successMsg = ref('');
   
   // Вычисляемое свойство для проверки, были ли изменения
   const isChanged = computed(() => {
       if (!props.currentTeam) return false;
       return formData.name !== (props.currentTeam.name || '') || 
              formData.sport_id !== (props.currentTeam.sport_id || '');
   });
   
   // Заполнение формы при открытии/изменении currentTeam
   const populateForm = () => {
       errorMsg.value = ''; 
       successMsg.value = '';
       if (props.currentTeam) {
           formData.name = props.currentTeam.name || '';
           // Устанавливаем sport_id, убедившись, что он число
           formData.sport_id = props.currentTeam.sport_id ? Number(props.currentTeam.sport_id) : ''; 
       }
   };
   
   watch(() => props.isOpen, (newVal) => {
     if (newVal) {
       populateForm();
       // Загружаем спорты, если их нет
       if (metaStore.sports.length === 0 && !metaStore.sportsLoading) {
           metaStore.fetchSports();
       }
     }
   }, { immediate: true }); 
   
   // Обработчик сохранения
   const handleUpdateTeam = async () => {
       if (!isChanged.value) {
           successMsg.value = 'No changes detected.';
           setTimeout(closeModal, 1500);
           return;
       }
   
       errorMsg.value = '';
       successMsg.value = '';
       isLoading.value = true;
   
       // Собираем только измененные данные
       const payload = {};
       if (formData.name !== (props.currentTeam?.name || '')) {
           payload.name = formData.name; // Для PUT /teams/{id} бэк ожидает name
       }
        if (formData.sport_id !== (props.currentTeam?.sport_id || '')) {
           payload.sport_id = parseInt(formData.sport_id); // Ожидает sport_id
       }
   
       try {
           await apiClient.put(`/teams/${props.currentTeam.id}`, payload);
           successMsg.value = 'Team updated successfully!';
           emit('teamUpdated'); 
           setTimeout(closeModal, 1500); 
   
       } catch (err) {
           console.error("Error updating team:", err);
           errorMsg.value = err.response?.data?.message || 'Failed to update team.';
       } finally {
           isLoading.value = false;
       }
   };
   
   const closeModal = () => {
     emit('close');
   };
   
   </script>
   
   <style scoped>
   
   </style>