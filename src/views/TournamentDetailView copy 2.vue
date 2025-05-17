<template>
  <div class="py-8 space-y-6 poppins">
    
    <div class="mb-4 flex justify-between items-center">
      <router-link 
        to="/tournaments" 
        class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-myyellow)] inline-flex items-center group"
      >
        <el-icon class="mr-1 transition-transform group-hover:-translate-x-1"><ArrowLeftBold /></el-icon>
        Back to Tournaments
      </router-link>

      <div v-if="tournament && authStore.isAuthenticated && authStore.userId === tournament.organizer_id">
        <el-button 
            type="primary" 
            plain 
            size="small"
            @click="openEditTournamentModal"
            :icon="Edit"
        >
            Edit Tournament
        </el-button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-20">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="errorMsg" class="text-center py-10 bg-[var(--color-primary)] p-6 rounded-lg shadow-xl">
      <el-result icon="error" title="Error Loading Tournament" :sub-title="errorMsg">
        <template #extra>
          <el-button type="primary" @click="fetchTournamentDetails(props.id)">Try Again</el-button>
        </template>
      </el-result>
    </div>

    <div v-else-if="tournament" class="space-y-8">
      <div class="relative bg-[var(--color-primary)] p-6 md:p-8 rounded-[1vw] shadow-xl overflow-hidden">
        <div class="flex flex-col sm:flex-row justify-end items-start gap-2 mb-3">
          <h1 class="text-2xl lg:text-3xl font-['Jaro'] text-[var(--color-text-light)] break-words flex-grow">
            {{ tournament.name }}
          </h1>
          <span 
            :class="[getStatusBgClass(tournament.status), 'text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap block sm:inline-block text-center shadow-sm mt-1 sm:mt-0']"
          >
            {{ tournament.status }}
          </span>
        </div>
        <img 
          v-if="tournament.logo_url" 
          :src="tournament.logo_url" 
          alt=""
          aria-hidden="true"
          class="absolute inset-0 w-full h-full object-cover opacity-20 blur-md pointer-events-none select-none"
          style="z-index: 0;" 
        />

        <div class="relative z-10 flex flex-col md:flex-row items-start gap-6">
          <div class="flex-shrink-0 w-full md:w-48 lg:w-64">
            <div class="aspect-[4/3] bg-[var(--color-secondary)] rounded-lg flex items-center justify-center overflow-hidden shadow-md">
              <img 
                v-if="tournament.logo_url" 
                :src="tournament.logo_url" 
                :alt="`${tournament.name} Logo`"
                class="w-full h-full object-cover"
              >
              <el-icon v-else :size="40" class="text-[var(--color-text-muted)]"><Picture /></el-icon>
            </div>
          </div>

          <div class="flex-grow">
            <p v-if="tournament.description" class="mb-4 text-sm text-[var(--color-text-muted)] whitespace-pre-wrap leading-relaxed bg-secondary/60 p-3 rounded-md">{{ tournament.description }}</p>
            <p v-else class="mb-4 text-sm text-[var(--color-text-muted)] italic">No description provided.</p>
              <div class="text-left sm:text-right">
                <el-button 
                  v-if="canAttemptDisplayRegistrationButton"
                  type="danger" 
                  size="large"
                  class="font-['Jaro']"
                  @click="handleRegister"
                  :loading="isRegistering"
                  :disabled="isRegistered || !isRegistrationOpen" 
                >
                  <span v-if="isRegistering">Processing...</span>
                  <span v-else-if="isRegistered">You are Registered</span>
                  <span v-else-if="!isRegistrationOpen">Registration Opens Soon</span>
                  <span v-else-if="!isRegistrationOpen">Registration Closed</span>
                  <span v-else>Register Now</span>
                </el-button>
                <el-tag v-else-if="tournament.status === 'completed'" type="success" size="large" effect="light"> This tournament has ended. </el-tag>
                <el-tag v-else-if="tournament.status === 'canceled'" type="warning" size="large" effect="light"> This tournament has been canceled. </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl">
        <el-tabs v-model="activeTab" type="card" class="tournament-tabs">
          <el-tab-pane label="About" name="about">
            <div class="p-6 space-y-6"> 
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div class="space-y-3">
                   <InfoItem label="Sport" :value="sportName" :is-loading="metaStore.sportsLoading" capitalize />
                   <InfoItem label="Format" :value="getFormatNameById(tournament.format_id)" />
                   <InfoItem label="Organizer">
                      <router-link 
                        v-if="tournament.organizer" 
                        :to="{ name: 'user-profile', params: { id: tournament.organizer.id } }" 
                        class="text-[var(--color-myyellow)] hover:underline"
                      >
                        {{ tournament.organizer.first_name }} {{ tournament.organizer.last_name }}
                        <span v-if="tournament.organizer.nickname">({{ tournament.organizer.nickname }})</span>
                      </router-link>
                      <span v-else-if="tournament.organizer_id" class="text-[var(--color-text-light)]">
                        ID: {{ tournament.organizer_id }} (Details unavailable)
                      </span>
                      <span v-else class="text-[var(--color-text-light)]">N/A</span>
                   </InfoItem>
                   <InfoItem v-if="tournament.location" label="Location" :value="tournament.location" />
                   <InfoItem label="Max Participants" :value="String(tournament.max_participants)" />
                   <InfoItem label="Current Players" :value="`${participantCount}/`" :suffix="String(tournament.max_participants)" />
                </div>
                
                <div class="space-y-1">
                  <h3 class="text-md font-semibold text-[var(--color-text-muted)] mb-3">Key Dates</h3>
                  <el-timeline v-if="tournamentTimelineActivities.length > 0" class="tournament-timeline">
                      <el-timeline-item
                          v-for="(activity, index) in tournamentTimelineActivities"
                          :key="index"
                          :timestamp="activity.formattedTimestamp" 
                          placement="top" 
                          :color="activity.color"
                          :hollow="activity.isPast"
                          :type="activity.type"
                          size="large"
                      >
                         <span :class="[activity.isPast ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-light)]', 'font-medium']">
                           {{ activity.content }}
                         </span>
                      </el-timeline-item>
                   </el-timeline>
                   <p v-else class="text-[var(--color-text-muted)] italic">Date information not available.</p>
               </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane name="participants">
            <template #label>
              <div class="flex items-center">
              <span>Participants</span>
              <el-badge :value="participantCount" class="ml-2" :max="99" :type="participantCount > 0 ? 'primary' : 'info'" />
              </div>
            </template>
            <div class="p-6">
                <div v-if="isLoadingParticipants" class="text-center text-[var(--color-text-muted)] py-4">
                    <el-skeleton :rows="3" animated />
                </div>
                <div v-else-if="participantsError" class="text-center text-red-500 py-4">
                    <el-result icon="error" title="Error Loading Participants" :sub-title="participantsError" />
                </div>
                <div v-else-if="participants.length === 0" class="text-center text-[var(--color-text-muted)] py-4">
                    <el-empty description="No participants have registered yet." :image-size="100" />
                </div>
                <ul v-else class="space-y-3">
                    <li v-for="p in participants" :key="p.id" 
                        class="flex items-center space-x-4 p-3 bg-[var(--color-secondary)] rounded-lg shadow hover:shadow-md transition-shadow">
                        
                        <div class="flex-shrink-0">
                            <img 
                                v-if="p.user && (p.user.logo_url || p.user.avatarUrl)" 
                                :src="p.user.logo_url || p.user.avatarUrl" 
                                alt="User Avatar" 
                                class="w-12 h-12 rounded-lg object-cover"
                            />
                            <img 
                                v-else-if="p.team && p.team.logo_url" 
                                :src="p.team.logo_url" 
                                alt="Team Logo" 
                                class="w-12 h-12 rounded-lg object-cover"
                            />
                            <img 
                                v-else 
                                :src="`https://api.dicebear.com/8.x/identicon/svg?seed=${p.user?.email || p.team?.name || p.id}`" 
                                :alt="p.user ? 'User Avatar' : 'Team Logo'" 
                                class="w-12 h-12 rounded-lg object-cover"
                            />
                        </div>
                        
                        <div class="flex-grow min-w-0">
                            <router-link 
                                v-if="p.user" 
                                :to="{ name: 'user-profile', params: { id: p.user_id } }" 
                                class="block text-sm font-semibold text-[var(--color-text-light)] hover:text-[var(--color-myyellow)] truncate"
                                :title="`${p.user.first_name} ${p.user.last_name}`"
                            >
                                {{ p.user.first_name }} {{ p.user.last_name }}
                                <span v-if="p.user.nickname" class="text-xs text-[var(--color-text-muted)]"> ({{ p.user.nickname }})</span>
                            </router-link>
                            <span v-if="p.team" class="block text-sm font-semibold text-[var(--color-text-light)] truncate" :title="p.team.name">
                                Team: {{ p.team.name }}
                            </span>
                            <p v-if="p.user" class="text-xs text-[var(--color-text-muted)] truncate" :title="p.user.email">{{ p.user.email }}</p>
                        </div>

                        <el-tag 
                            :type="getParticipantStatusTagType(p.status)" 
                            size="small" 
                            effect="light"
                            class="ml-auto flex-shrink-0"
                        >
                            {{ p.status }}
                        </el-tag>
                    </li>
                </ul>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Bracket" name="bracket"> <div class="p-6 text-center text-[var(--color-text-muted)]">Bracket section (Coming Soon)</div> </el-tab-pane>
          <el-tab-pane label="Results" name="results"> <div class="p-6 text-center text-[var(--color-text-muted)]">Results section (Coming Soon)</div> </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div v-else class="text-center py-10 text-[var(--color-text-muted)]">
       Tournament not found.
    </div>
    <EditTournamentModal 
    v-if="tournament"
    :is-open="isEditTournamentModalOpen"
    :tournament="tournament"
    @close="closeEditTournamentModal"
    @tournament-updated="handleTournamentUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import apiClient from '@/services/apiClient';
import { useMetaStore } from '@/stores/metaStore'; 
import { useAuthStore } from '@/stores/authStore'; 
import { ElTimeline, ElTimelineItem, ElTabs, ElTabPane, ElButton, ElIcon, ElResult, ElSkeleton, ElBadge, ElMessage } from 'element-plus';
import { ArrowLeftBold, Picture, Edit } from '@element-plus/icons-vue'; // Добавили Edit
import EditTournamentModal from '@/components/modals/EditTournamentModal.vue'; // Импортируем новую модалку


// Локальный компонент для отображения элементов информации
const InfoItem = {
  props: ['label', 'value', 'isLoading', 'capitalize', 'suffix'],
  template: `
    <div class="flex items-start space-x-3">
      <strong class="text-[var(--color-text-muted)] w-32 inline-block flex-shrink-0 poppins">{{ label }}:</strong>
      <span v-if="isLoading" class="text-[var(--color-text-muted)] italic poppins">Loading...</span>
      <span v-else :class="['text-[var(--color-text-light)] poppins', { 'capitalize': capitalize }]">
        <slot>{{ value || 'N/A' }}</slot>
        <span v-if="suffix" class="text-[var(--color-text-light)] poppins">{{ suffix }}</span>
      </span>
    </div>
  `
};



const props = defineProps({
  id: { type: [String, Number], required: true }
});

const metaStore = useMetaStore();
const authStore = useAuthStore(); 

const tournament = ref(null);
const isLoading = ref(true);
const errorMsg = ref('');
const activeTab = ref('about'); 
const isRegistering = ref(false); 

const participants = ref([]);
const isLoadingParticipants = ref(false);
const participantsError = ref('');
const participantCount = computed(() => participants.value.length);
const isRegistered = ref(false); 
const isEditTournamentModalOpen = ref(false);

const fetchTournamentDetails = async (tournamentId) => {
  const id = parseInt(tournamentId);
  if (isNaN(id) || id <= 0) {
      errorMsg.value = 'Invalid Tournament ID.'; isLoading.value = false; tournament.value = null; return;
  }
  isLoading.value = true; errorMsg.value = ''; tournament.value = null;
  try {
    const response = await apiClient.get(`/tournaments/${id}`);
    if (response.data && response.data.tournament) {
        tournament.value = response.data.tournament;
        // TODO: Загрузить количество участников для этого турнира
        // fetchParticipantCount(id);
    } else { throw new Error('Tournament data not found in response.'); }
  } catch (err) {
    console.error("Error fetching tournament details:", err);
    errorMsg.value = err.response?.data?.message || `Failed to load tournament (ID: ${id}).`;
    if (err.response?.status === 404) errorMsg.value = `Tournament with ID ${id} not found.`;
  } finally { isLoading.value = false; }
};

const formatDateForTimelineDisplay = (dateString) => {
  if (!dateString) return 'Date TBD';
  try {
    return new Date(dateString).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }); 
  } catch (e) { return dateString; }
};

const tournamentTimelineActivities = computed(() => {
  const activities = [];
  const t = tournament.value;
  if (!t) return [];
  const now = new Date();

  if (t.reg_date) {
      const regDate = new Date(t.reg_date);
      activities.push({
          content: `Registration Closes`,
          timestamp: t.reg_date, 
          formattedTimestamp: formatDateForTimelineDisplay(t.reg_date),
          color: regDate < now ? 'var(--color-text-muted)' : '#E6A23C', // Element Plus Warning color
          isPast: regDate < now,
          type: regDate < now ? 'info' : 'warning'
      });
  }
  if (t.start_date) {
       const startDate = new Date(t.start_date);
      activities.push({
          content: `Tournament Starts`,
          timestamp: t.start_date,
          formattedTimestamp: formatDateForTimelineDisplay(t.start_date),
          color: startDate < now ? 'var(--color-text-muted)' : '#67C23A', // Element Plus Success color
          isPast: startDate < now,
          type: startDate < now ? 'info' : 'success' // Используем success для старта
      });
  }
  if (t.end_date) {
       const endDate = new Date(t.end_date);
      activities.push({
          content: `Tournament Ends`,
          timestamp: t.end_date,
          formattedTimestamp: formatDateForTimelineDisplay(t.end_date),
          color: endDate < now ? 'var(--color-text-muted)' : '#F56C6C', // Element Plus Danger color
          isPast: endDate < now,
          type: endDate < now ? 'info' : 'danger'
      });
  }
  return activities.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
});

const getStatusBgClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': case 'ongoing': return 'bg-myred text-white'; 
    case 'registration': return 'bg-myyellow text-primary'; 
    case 'completed': case 'ended': return 'bg-gray-700 text-gray-300'; 
    case 'soon': return 'bg-blue-600 text-white'; 
    case 'canceled': return 'bg-black text-gray-500'; 
    default: return 'bg-secondary text-white'; 
  }
};

const sportName = computed(() => tournament.value ? (metaStore.sportsMap[tournament.value.sport_id] || `ID: ${tournament.value.sport_id}`) : '...');
// Отображение имени формата (пока статично)
const getFormatNameById = (formatId) => {
    const id = Number(formatId);
    if (id === 1) return 'Single Elimination';
    if (id === 2) return 'Round Robin';
    if (id === 3) return 'Swiss';
    return `ID: ${formatId}`; // Fallback
};
// Показываем кнопку регистрации или тег статуса
const canAttemptDisplayRegistrationButton = computed(() => {
    if (!tournament.value) return false;
    return ['registration', 'soon', 'active'].includes(tournament.value.status) && 
           tournament.value.status !== 'canceled' && 
           tournament.value.status !== 'completed';
});

// Открыта ли регистрация по дате и статусу
const isRegistrationOpen = computed(() => {
    if (!tournament.value) return false;
    const now = new Date();
    const regEndDate = new Date(tournament.value.reg_date);
    return tournament.value.status === 'registration' && regEndDate > now;
});

const fetchParticipants = async (tournamentId) => {
    if (!tournamentId) return;
    isLoadingParticipants.value = true;
    participantsError.value = '';
    participants.value = [];
    isRegistered.value = false; 
    try {
        const response = await apiClient.get(`/tournaments/${tournamentId}/participants`);
        // Бэкенд возвращает массив участников в поле "participants" (согласно handler)
        const fetchedParticipants = response.data?.participants || [];
        
        // Обогащаем каждого участника URL аватара, если его нет
        participants.value = fetchedParticipants.map(p => {
            let avatar = '';
            if (p.user && (p.user.logo_url || p.user.avatarUrl)) { // Предпочитаем logo_url от бэка
                avatar = p.user.logo_url || p.user.avatarUrl;
            } else if (p.team && p.team.logo_url) {
                avatar = p.team.logo_url;
            } else {
                const seed = p.user?.email || p.user?.nickname || p.user?.first_name || p.team?.name || p.id;
                if (seed) avatar = `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
            }
            return { ...p, displayAvatarUrl: avatar };
        });
        
        if (authStore.isAuthenticated && authStore.userId) {
            isRegistered.value = participants.value.some(p => p.user_id === authStore.userId || (authStore.user?.team_id && p.team_id === authStore.user.team_id));
        }
    } catch (err) {
        console.error("Error fetching participants:", err);
        participantsError.value = err.response?.data?.message || 'Failed to load participants.';
    } finally {
        isLoadingParticipants.value = false;
    }
};

const handleRegister = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('You must be logged in to register.');
        // TODO: Редирект на логин с возвратом сюда
        // router.push({ name: 'login', query: { redirect: route.fullPath }});
        return;
    }
    if (!isRegistrationOpen.value) {
        ElMessage.warning('Registration is currently closed.');
        return;
    }
    if (isRegistered.value) {
        ElMessage.info('You are already registered for this tournament.');
        return;
    }

    isRegistering.value = true;
    const tournamentId = props.id;
    let registrationSuccessful = false;

    try {
        // TODO: Нужна логика определения типа турнира (solo/team) от бэкенда
        // Пока что, если пользователь в команде и капитан, регистрируем команду. Иначе - соло.
        const isUserInTeam = !!authStore.user?.team_id;
        const isUserCaptain = authStore.user?.team?.captain_id === authStore.userId;

        if (isUserInTeam && isUserCaptain) {
            // Попытка зарегистрировать команду
            // Бэкенд ожидает teamID в теле? (participantService.RegisterTeamParticipant принимает teamID)
            // Если да, то: await apiClient.post(`/tournaments/${tournamentId}/register/team`, { team_id: authStore.user.team_id });
            // Если бэкенд берет team_id из JWT пользователя (если он капитан), то тело пустое:
            await apiClient.post(`/tournaments/${tournamentId}/register/team`); 
            ElMessage.success(`Team "${authStore.user.team.name}" successfully registered for ${tournament.value.name}!`);
        } else if (!isUserInTeam) {
            // Соло регистрация
            await apiClient.post(`/tournaments/${tournamentId}/register/solo`);
            ElMessage.success(`Successfully registered for ${tournament.value.name}!`);
        } else {
            // Пользователь в команде, но не капитан - пока не даем регистрироваться
            ElMessage.warning('Only team captains can register their team. Solo registration is not available if you are in a team.');
            isRegistering.value = false;
            return;
        }
        registrationSuccessful = true;
        
    } catch (err) {
        console.error("Error registering for tournament:", err);
        ElMessage.error(err.response?.data?.message || 'Registration failed. You might already be registered, the tournament is full, or registration is closed.');
    } finally {
        isRegistering.value = false;
        if (registrationSuccessful) {
            fetchParticipants(tournamentId); // Обновляем список участников и статус isRegistered
        }
    }
};

// Функция для определения типа тега Element Plus для статуса участника
const getParticipantStatusTagType = (status) => {
    switch(status?.toLowerCase()){
        case 'application_submitted': return 'warning';
        case 'participant': return 'success'; // Или 'primary'
        case 'rejected': return 'danger';
        case 'cancelled': return 'info';
        default: return 'info';
    }
};

// --- НОВЫЕ: Функции для модалки редактирования турнира ---
const openEditTournamentModal = () => {
    isEditTournamentModalOpen.value = true;
};
const closeEditTournamentModal = () => {
    isEditTournamentModalOpen.value = false;
};
const handleTournamentUpdated = async (updatedTournamentData) => {
    console.log('Tournament updated event received in DetailView:', updatedTournamentData);
    // Перезагружаем данные текущего турнира, чтобы отобразить изменения
    await fetchTournamentDetails(props.id); 
    // Модалка закроется сама
};
// --------------------------------------------------------

watch(() => props.id, 
    (newId) => {
        if (newId) {
            activeTab.value = 'about'; // Сбрасываем на "About" при смене турнира
            fetchTournamentDetails(newId);
            fetchParticipants(newId); // Загружаем участников сразу
        }
    }, 
    { immediate: true } 
);

watch(activeTab, (newTab) => {
    // Загружаем участников, только если вкладка активна и они еще не загружены (или была ошибка)
    if (newTab === 'participants' && props.id && (participants.value.length === 0 || participantsError.value) && !isLoadingParticipants.value) {
        fetchParticipants(props.id);
    }
});

onMounted(() => {
    if (metaStore.sports.length === 0 && !metaStore.sportsLoading) metaStore.fetchSports();
    if (metaStore.formats.length === 0 && !metaStore.formatsLoading) metaStore.fetchFormats();
});
</script>

<style>
/* Глобальные стили для кастомизации Element Plus табов под темную тему */
.tournament-tabs .el-tabs__header {
  background-color: var(--color-secondary);
  border-bottom: 1px solid var(--color-primary);
  margin: 0;
}
.tournament-tabs .el-tabs__nav-wrap::after {
  display: none; /* Убираем стандартную нижнюю линию */
}
.tournament-tabs .el-tabs__item {
  color: var(--color-text-muted);
  background-color: var(--color-secondary);
  border-bottom-color: transparent !important; /* Убираем нижнюю рамку у неактивных */
  border-left: none !important;
  border-right: none !important;
  border-top: none !important;
  padding: 0 20px !important;
  height: 45px;
  line-height: 45px;
}
.tournament-tabs .el-tabs__item.is-active {
  color: var(--color-myred);
  background-color: var(--color-primary); /* Фон активного таба как у контента */
  border-bottom: 2px solid var(--color-myred) !important; /* Акцентируем активный таб */
}
.tournament-tabs .el-tabs__item:hover {
  color: var(--color-text-light);
}
.tournament-tabs .el-tabs__content {
  background-color: var(--color-primary);
}

/* Стили для el-timeline, чтобы соответствовать темной теме */
.tournament-timeline .el-timeline-item__timestamp.is-top {
  color: var(--color-text-muted) !important;
  font-size: 0.8rem;
  margin-bottom: 4px;
}
.tournament-timeline .el-timeline-item__wrapper {
 padding-left: 20px !important; /* Немного уменьшим отступ */
}
.tournament-timeline .el-timeline-item__tail {
  border-left: 2px solid var(--color-secondary) !important; 
}
.tournament-timeline .el-timeline-item__node {
  /* background-color: var(--color-myyellow) !important; */ /* Можно задать цвет точки, если :color не сработает как ожидается */
  border-radius: 0.7vw;
}
.tournament-timeline .el-timeline-item__node--large {
    left: -3px; /* Корректировка позиции большой точки */
    width: 14px;
    height: 14px;
}
.el-button--danger {
    background-color: var(--color-myred);
    padding: 10px;
    border-radius: 0.7vw;
    color: var(--color-text-light);
    font-size: var(--text-sm);
    font-weight: 500;
}
.el-tag.el-tag--info:hover {
    --el-tag-bg-color: var(--color-myreddarker);
}

</style>
