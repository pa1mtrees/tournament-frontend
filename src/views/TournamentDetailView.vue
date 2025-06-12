<template>
  <div class="py-8 space-y-6 poppins">
    
    <div class="mb-4 flex justify-between items-center">
      <router-link 
        to="/tournaments" 
        class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-myred)] inline-flex items-center group"
      >
        <el-icon class="mr-1 transition-transform group-hover:-translate-x-1"><ArrowLeftBold /></el-icon>
        Back to Tournaments
      </router-link>

      <div v-if="isOrganizer" class="flex items-center space-x-2">
        <button
          class="bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold"
          type="primary"
          plain
          size="small"
          @click="openEditTournamentModal"
        >
          <div class="flex space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3"
            >
            <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/>
            <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3"/>
            </svg>
            <span>Edit Tournament</span>
          </div>
        </button>
        <button
          class="bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold"
          type="primary"
          plain
          size="small"
          @click="confirmDeleteTournament"
          :loading="isDeletingTournament"
        >
          <div class="flex items-center space-x-1 text-[var(--color-text-light)] font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span v-if="!isDeletingTournament">Delete</span>
            <span v-else>Deleting...</span>
          </div>
        </button>
        <!-- <el-button 
            class="bg-myred px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold"
            type="danger" 
            plain 
            size="small"
            @click="confirmDeleteTournament"
            :loading="isDeletingTournament"
        >
          <div class="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Edit Tournament</span>
          </div>
            <span v-if="!isDeletingTournament"></span>
            <span v-else>Deleting...</span>
        </el-button> -->
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-20">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="errorMsg" class="text-center py-10 bg-[var(--color-primary)] p-6 rounded-lg shadow-xl">
      <el-result icon="error" title="Error Loading Tournament" :sub-title="errorMsg">
        <template #extra>
          <el-button type="danger" @click="fetchTournamentDetails(props.id)">Try Again</el-button>
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
          <div class="flex-shrink-0 md:w-48 lg:w-64">
            <div class="rounded-lg flex items-center justify-center overflow-visible">
              <img 
                v-if="tournament.logo_url" 
                :src="tournament.logo_url" 
                :alt="`${tournament.name} Logo`"
                class="w-1/2 h-1/2 md:w-full md:h-full object-contain m-2 rounded-3xl"
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
                <el-tag v-else-if="tournament.status === 'completed'" type="info" size="large" effect="dark"> This tournament has ended. </el-tag>
                <el-tag v-else-if="tournament.status === 'canceled'" type="warning" size="large" effect="dark"> This tournament has been canceled. </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl">
        <CustomTabs :tabs="tabItems" v-model:activeTab="activeTab" />
        
        <div class="tab-content p-6">
          <div v-if="activeTab === 'about'" class="space-y-6"> 
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div class="space-y-3">
                 <InfoItem label="Sport" :value="sportName" :is-loading="metaStore.sportsLoading" capitalize />
                 <InfoItem label="Format" :value="getFormatNameById(tournament.format_id)" />
                 <InfoItem label="Organizer">
                    <router-link 
                      v-if="tournament.organizer" 
                      :to="{ name: 'user-profile', params: { id: tournament.organizer.id } }" 
                      class="text-[var(--color-myred)] hover:underline"
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
                 <InfoItem label="Current Players" :value="`${participantCount} /`" :suffix="String(tournament.max_participants)" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl text-[var(--color-text-light)] mb-3">Key Dates</h3>
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

          <div v-if="activeTab === 'participants'">
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
                      class="flex flex-row sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 bg-[var(--color-secondary)] rounded-lg shadow hover:shadow-md transition-shadow">
                      <div class="flex items-center space-x-4 flex-grow w-full sm:w-auto">
                          <div class="flex-shrink-0">
                              <img 
                                  v-if="p.user && (p.user.logo_url || p.user.avatarUrl)" 
                                  :src="p.user.logo_url || p.user.avatarUrl" 
                                  alt="User Avatar" 
                                  class="w-6 h-6 md:w-12 md:h-12 rounded-lg object-cover"
                              />
                              <img 
                                  v-else-if="p.team && p.team.logo_url" 
                                  :src="p.team.logo_url" 
                                  alt="Team Logo" 
                                  class="w-6 h-6 md:w-12 md:h-12 rounded-lg object-contain"
                              />
                              <img 
                                  v-else 
                                  :src="p.displayAvatarUrl" 
                                  :alt="p.user ? 'User Avatar' : (p.team ? 'Team Logo' : 'Participant Avatar')" 
                                  class="w-6 h-6 md:w-12 md:h-12 rounded-lg object-cover"
                              />
                          </div>
                          <div class="flex-grow min-w-0">
                              <router-link 
                                  v-if="p.user" 
                                  :to="{ name: 'user-profile', params: { id: p.user_id } }" 
                                  class="block text-xs md:text-lg font-semibold text-[var(--color-text-light)] hover:text-[var(--color-myred)] truncate"
                                  :title="`${p.user.first_name} ${p.user.last_name}`"
                              >
                                  {{ p.user.first_name }} {{ p.user.last_name }}
                                  <span v-if="p.user.nickname" class="text-xs md:text-lg text-[var(--color-text-muted)]"> ({{ p.user.nickname }})</span>
                              </router-link>
                              <router-link
                                  v-if="p.team"
                                  :to="{ name: 'team', params: { teamId: p.team_id } }"
                                  class="block text-xs md:text-lg font-semibold text-[var(--color-text-light)] hover:text-[var(--color-myred)] truncate"
                                  :title="p.team.name"
                              >
                                  {{ p.team.name }}
                              </router-link>
                              <p v-if="p.user" class="text-xs text-[var(--color-text-muted)] truncate" :title="p.user.email">{{ p.user.email }}</p>
                          </div>
                      </div>
                      <div class="flex items-center space-x-2 ml-auto flex-shrink-0 sm:w-auto justify-end">
                          <el-tag 
                              :type="getParticipantStatusTagType(p.status)" 
                              size="default"
                              effect="dark"
                              round
                              class="flex-shrink-0"
                          >
                              <span class="text-secondary text-xs md:text-sm font-semibold">{{ getDisplayParticipantStatus(p.status) }}</span>
                          </el-tag>

                          <!-- Organizer Actions for Applications -->
                          <div v-if="isOrganizer && p.status === 'application_submitted'" class="flex space-x-1 flex-shrink-0">
                              <el-button 
                                  type="success" 
                                  size="small" 
                                  @click="handleApplication(p.id, 'participant')"
                                  :loading="p.isUpdatingStatus"
                                  plain
                                  circle
                                  title="Accept Application"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </el-button>
                              <el-button 
                                  type="danger" 
                                  size="small" 
                                  @click="handleApplication(p.id, 'application_rejected')"
                                  :loading="p.isUpdatingStatus"
                                  plain
                                  circle
                                  title="Reject Application"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </el-button>
                          </div>
                      </div>
                  </li>
              </ul>
          </div>
          </div>

            <!-- BRACKET TAB CONTENT START -->
            <div v-if="activeTab === 'bracket'" class="pt-0 p-4 md:pt-0 md:p-6 min-h-[300px]">
              <div v-if="isLoadingBracket" class="text-center py-10">
                <el-skeleton :rows="5" animated />
              </div>
              <div v-else-if="bracketData">
                <!-- Conditional rendering based on bracket_type -->
                <template v-if="bracketData.format && bracketData.format.bracket_type === 'RoundRobin'">
                  <RoundRobinDisplay 
                    :bracket-data="bracketData" 
                    :loading="isLoadingBracket"
                    :get-avatar-for-bracket-participant="getAvatarForBracketParticipant"
                    :format-match-time-for-display="formatMatchTime" 
                  />
                </template>
                <template v-else-if="bracketData.format && (bracketData.format.bracket_type === 'SingleElimination' || !bracketData.format.bracket_type) && bracketData.rounds && bracketData.rounds.length > 0">
                  <!-- Existing Single Elimination Display (direct rendering from your file) -->
                  <!-- Round Titles -->
                  <div 
                    class="mb-6 grid items-center border-0 border-b-2 border-[var(--color-secondary)] text-center text-sm sm:text-base md:text-lg font-bold uppercase text-[var(--color-text-light)]"
                    :style="{ 'grid-template-columns': `repeat(${bracketData.rounds.length}, minmax(0, 1fr))` }"
                  >
                    <div v-for="round in bracketData.rounds" :key="`title-${round.round_number}`" class="py-2 px-1">
                      {{ getRoundDisplayName(round.round_number, bracketData.rounds.length) }}
                    </div>
                  </div>

                  <!-- Matches Grid -->
                  <div 
                    class="grid gap-x-2 sm:gap-x-4 items-center"  
                    :style="{ 'grid-template-columns': `repeat(${bracketData.rounds.length}, minmax(0, 1fr))` }"
                  >
                    <div 
                      v-for="round in bracketData.rounds" 
                      :key="`round-col-${round.round_number}`" 
                      class="round-column space-y-3 sm:space-y-4"
                    >
                      <div 
                        v-for="match in round.matches" 
                        :key="match.bracket_match_uid || match.match_id" 
                        class="match-item-container"
                      >
                        <div class="rounded-md bg-[var(--color-secondary)] px-2.5 py-2 sm:px-3 sm:py-2.5 text-[var(--color-text-light)] shadow-md">
                          <!-- Participant 1 -->
                          <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-1.5 sm:space-x-2 overflow-hidden min-w-0">
                              <img 
                                v-if="match.participant1?.logo_url" 
                                :src="match.participant1.logo_url" 
                                class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm object-cover flex-shrink-0" 
                                :alt="match.participant1.name || 'P1'"
                              >
                              <img 
                                v-else-if="match.participant1" 
                                :src="getAvatarForBracketParticipant(match.participant1)" 
                                class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm object-cover flex-shrink-0" 
                                :alt="match.participant1.name || 'P1'"
                              >
                              <span 
                                v-else 
                                class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm flex-shrink-0 bg-gray-700/30"
                              ></span>
                              <p class="font-semibold text-xs sm:text-sm truncate" :title="match.participant1?.name">{{ match.participant1?.name || 'TBD' }}</p>
                            </div>
                            <p class="text-xs sm:text-sm font-semibold ml-1">
                              {{ 
                                (match.score_string && typeof match.score_string === 'string' && match.score_string.split('-').length === 2) 
                                ? match.score_string.split('-')[0].trim() 
                                : (match.participant1 ? '-' : '') 
                              }}
                            </p>
                          </div>
                          
                          <div class="my-1 h-px bg-gray-700/30"></div>

                          <!-- Participant 2 -->
                          <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-1.5 sm:space-x-2 overflow-hidden min-w-0">
                              <img 
                                v-if="match.participant2?.logo_url" 
                                :src="match.participant2.logo_url" 
                                class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm object-cover flex-shrink-0" 
                                :alt="match.participant2.name || 'P2'"
                              >
                              <img 
                                v-else-if="match.participant2" 
                                :src="getAvatarForBracketParticipant(match.participant2)" 
                                class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm object-cover flex-shrink-0" 
                                :alt="match.participant2.name || 'P2'"
                              >
                              <span 
                                v-else 
                                class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm flex-shrink-0 bg-gray-700/30"
                              ></span>
                              <p class="font-semibold text-xs sm:text-sm truncate" :title="match.participant2?.name">{{ match.participant2?.name || 'TBD' }}</p>
                            </div>
                            <p class="text-xs sm:text-sm font-semibold ml-1">
                              {{ 
                                (match.score_string && typeof match.score_string === 'string' && match.score_string.split('-').length === 2) 
                                ? match.score_string.split('-')[1].trim() 
                                : (match.participant2 ? '-' : '') 
                              }}
                            </p>
                          </div>
                          
                          <div v-if="match.status && match.status.toLowerCase() !== 'completed' && match.status.toLowerCase() !== 'finished'" class="text-xs text-center text-[var(--color-text-muted)] mt-2 pt-1.5 border-t border-gray-700/30">
                            {{ match.status.replace('_', ' ') }}
                            <span v-if="match.match_time"> @ {{ formatMatchTime(match.match_time) }}</span>
                          </div>
                          <div v-if="(match.status.toLowerCase() === 'completed' || match.status.toLowerCase() === 'finished') && match.winner_participant_db_id" class="text-xs text-center text-green-400 mt-1.5 pt-1 border-t border-gray-700/30 font-semibold">
                            Winner: {{ bracketData.participants_map && bracketData.participants_map[match.winner_participant_db_id]?.name || 'N/A' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- Fallback for other bracket types or if data structure is unexpected -->
                  <div class="text-center py-10 text-[var(--color-text-muted)]">
                      <el-empty :description="`Bracket display for '${bracketData.format?.name || 'this format'}' is not yet implemented or data is incomplete for this view.`" :image-size="100" />
                  </div>
                </template>
              </div>
              <div v-else-if="!isLoadingBracket" class="text-center py-10 text-[var(--color-text-muted)]">
                <el-empty description="Bracket data is not available or has not been generated yet." :image-size="100" />
              </div>
            </div>
            <!-- BRACKET TAB CONTENT END -->


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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import apiClient from '@/services/apiClient';
import { useMetaStore } from '@/stores/metaStore'; 
import { useAuthStore } from '@/stores/authStore';
import { getDiceBearAvatarUrl } from '@/utils/avatarUtils';
// Убираем ElTabs, ElTabPane из импортов Element Plus
import { ElTimeline, ElTimelineItem, ElButton, ElIcon, ElResult, ElSkeleton, ElBadge, ElMessage, ElEmpty, ElTag } from 'element-plus'; 
import { ArrowLeftBold, Picture, Edit, Delete, UserFilled, TrophyBase, Files as FilesIcon, List as ListNumbers } from '@element-plus/icons-vue'; // Добавили иконки для табов
import EditTournamentModal from '@/components/modals/EditTournamentModal.vue';
import CustomTabs from '@/components/ui/CustomTabs.vue'; // Импортируем наш новый компонент
import RoundRobinDisplay from '@/components/tournament/RoundRobinDisplay.vue';

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

const router = useRouter(); // Инициализируем роутер
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
const isDeletingTournament = ref(false);
const isUpdatingStatus = ref(false); // Для отслеживания статуса обновления участника

const bracketData = ref(null);
const isLoadingBracket = ref(false);
const bracketError = ref('');
const socket = ref(null); // To hold the WebSocket instance

// --- WebSocket Functions ---
const setupWebSocket = (tournamentId) => {
  if (!tournamentId) return;

  // Close any existing connection
  closeWebSocket();

  // Determine WebSocket URL (adjust protocol and host/port as needed)
  // Assuming your backend WebSocket endpoint is something like /ws/tournaments/:id/bracket
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${window.location.host}/ws/tournaments/${tournamentId}`; 
  // OR if your API is on a different domain/port:
  // const wsUrl = `ws://your-backend-api-domain.com/ws/tournaments/${tournamentId}/bracket`;

  console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
  socket.value = new WebSocket(wsUrl);

  socket.value.onopen = () => {
    console.log('WebSocket connection established for bracket updates.');
    isLoadingBracket.value = false; // Assuming WebSocket might send initial data or confirm connection
    bracketError.value = '';
    // You might want to send a message to the backend if it expects a subscription confirmation
    // socket.value.send(JSON.stringify({ action: 'subscribe', tournamentId: tournamentId }));
  };

  socket.value.onmessage = (event) => {
    try {
      const eventData = JSON.parse(event.data);
      console.log('Received update via WebSocket:', eventData);
      
      // Assuming your backend sends a message type or specific structure for bracket updates
      // For example: if (eventData.type === 'bracket_update') {
      //   bracketData.value = eventData.payload;
      // } else if (eventData.type === 'other_update') { ... }
      // For now, let's assume any message is a full bracket update if this WS is dedicated to it.
      // If the WS sends various tournament updates, you'll need to filter/route them.
      
      // If you are sure this specific WebSocket endpoint only sends bracket data:
      bracketData.value = eventData; // Or eventData.bracket, eventData.payload, etc.
                                   // depending on your backend's message structure.

      isLoadingBracket.value = false;
      bracketError.value = '';
    } catch (e) {
      console.error('Error parsing WebSocket message or updating data:', e);
    }
  };

  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error);
    bracketError.value = 'WebSocket connection error. Real-time updates may be unavailable.';
    // isLoadingBracket.value = false; // Stop loading on error
    // Optionally, you could try to reconnect here or fall back to polling if critical
  };

  socket.value.onclose = (event) => {
    console.log('WebSocket connection closed:', event.reason || `Code: ${event.code}`);
    // socket.value = null; // Clear the ref
    // You might want to implement a reconnection logic if the closure was unexpected
    if (event.wasClean) {
        console.log(`WebSocket closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('WebSocket connection died');
        if (activeTab.value === 'bracket' && props.id) { // Only attempt reconnect if still relevant
            // bracketError.value = 'WebSocket connection lost. Attempting to reconnect...';
            // setTimeout(() => setupWebSocket(props.id), 5000); // Simple reconnect attempt
        }
    }
  };
};

const closeWebSocket = () => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    console.log('Closing WebSocket connection.');
    socket.value.close();
  }
  socket.value = null;
};
// --- End WebSocket Functions ---

// --- New function to fetch bracket data ---
const fetchBracketData = async (tournamentId) => {
  if (!tournamentId) return;
  // If WebSocket is intended to provide the initial data, you might not need this,
  // or use it as a fallback if WebSocket connection fails.
  // For now, let's assume WebSocket will handle updates after an initial fetch or if it connects first.

  // If a WebSocket connection is already active or attempting, let it handle data.
  if (socket.value && (socket.value.readyState === WebSocket.OPEN || socket.value.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket is active or connecting, deferring initial fetch to WebSocket.');
      // We might still want a loading indicator until the first WebSocket message arrives
      if (!bracketData.value) { // Only show loading if no data yet
          isLoadingBracket.value = true;
      }
      return;
  }
  
  isLoadingBracket.value = true;
  bracketError.value = '';
  // bracketData.value = null; // Reset previous data - careful if WS is also setting this
  try {
    const response = await apiClient.get(`/tournaments/${tournamentId}/bracket`);
    bracketData.value = response.data;
  } catch (err) {
    console.error("Error fetching bracket data:", err);
    if (err.response?.status === 404) {
        bracketError.value = 'Bracket not found for this tournament or not generated yet.';
    } else {
        bracketError.value = err.response?.data?.message || 'Failed to load bracket data.';
    }
  } finally {
    isLoadingBracket.value = false;
  }
};
// --- End new function ---

// --- New helper function to format match time ---
const formatMatchTime = (dateTimeString) => {
  if (!dateTimeString) return 'TBD';
  try {
    return new Date(dateTimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (e) {
    return 'Invalid Date'; // Or handle more gracefully
  }
};
// --- End new helper ---

// --- New helper function to get round display names ---
const getRoundDisplayName = (currentRoundNumber, totalRoundsInBracketData) => {
  if (totalRoundsInBracketData <= 0) return `Round ${currentRoundNumber}`;
  
  // Handle single-round tournament (Final only)
  if (totalRoundsInBracketData === 1 && currentRoundNumber === 1) return 'Final';

  const roundsFromFinal = totalRoundsInBracketData - currentRoundNumber;

  if (roundsFromFinal === 0) return 'Final';
  if (roundsFromFinal === 1 && totalRoundsInBracketData > 1) return 'Semifinals';
  if (roundsFromFinal === 2 && totalRoundsInBracketData > 2) return 'Quarterfinals';
  if (roundsFromFinal === 3 && totalRoundsInBracketData > 3) return 'Round of 16';
  if (roundsFromFinal === 4 && totalRoundsInBracketData > 4) return 'Round of 32';
  // Add more specific names if needed
  return `Round ${currentRoundNumber}`;
};
// --- End new helper ---

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
          content: `Registration Starts`,
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
    case 'registration': return 'bg-green-500 text-primary'; 
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
  // If there's no tournament data, registration cannot be determined to be open.
  if (!tournament.value) {
    return false;
  }
  // Registration is considered open if the tournament status is 'registration'.
  return tournament.value.status === 'registration';
});

const fetchParticipants = async (tournamentId) => {
    if (!tournamentId) return;
    isLoadingParticipants.value = true;
    participantsError.value = '';
    isRegistered.value = false; 
    try {
        const response = await apiClient.get(`/tournaments/${tournamentId}/participants`);
        const fetchedParticipants = response.data?.participants || [];
        
        participants.value = fetchedParticipants.map(p => {
            let avatar = '';
            if (p.user && (p.user.logo_url || p.user.avatarUrl)) {
                avatar = p.user.logo_url || p.user.avatarUrl;
            } else if (p.team && p.team.logo_url) {
                avatar = p.team.logo_url;
            } else {
                // Use the centralized utility function
                avatar = getDiceBearAvatarUrl(p); 
            }
            return { ...p, displayAvatarUrl: avatar, isUpdatingStatus: false };
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

// Helper function for bracket avatars
const getAvatarForBracketParticipant = (bracketParticipantInfo) => {
  // bracketParticipantInfo is an object like { id: user_or_team_db_id, name: 'Name', logo_url: 'url' | null }
  if (!bracketParticipantInfo) return ''; // Return empty or a path to a default placeholder
  
  // 1. Use logo_url from bracket data if available
  if (bracketParticipantInfo.logo_url) {
    return bracketParticipantInfo.logo_url;
  }

  // 2. Try to find the full participant data from participants.value
  //    This data (displayAvatarUrl) would have been generated using the canonical getDiceBearAvatarUrl
  if (participants.value && participants.value.length > 0) {
    const fullParticipantData = participants.value.find(p => 
      (p.user_id && String(p.user_id) === String(bracketParticipantInfo.id)) ||
      (p.team_id && String(p.team_id) === String(bracketParticipantInfo.id))
    );

    if (fullParticipantData && fullParticipantData.displayAvatarUrl) {
      return fullParticipantData.displayAvatarUrl;
    }
  }
  
  // 3. Fallback: If not found in participants.value or no displayAvatarUrl there,
  //    generate DiceBear URL directly using the bracketParticipantInfo.
  //    The getDiceBearAvatarUrl utility will use bracketParticipantInfo.id or .name for the seed.
  return getDiceBearAvatarUrl(bracketParticipantInfo); 
};

const handleApplication = async (participantId, newStatus) => {
    const tournamentId = props.id; // Keep tournamentId for refreshing the list
    const participant = participants.value.find(p => p.id === participantId);
    if (!participant) return;

    participant.isUpdatingStatus = true; // Set loading state for this participant

    try {
        // Backend endpoint is PATCH /participants/{participantID}/status
        await apiClient.patch(`/participants/${participantId}/status`, {
            status: newStatus 
        });
        ElMessage.success(`Application ${newStatus === 'participant' ? 'accepted' : 'rejected'} successfully.`);
        // Refresh the participants list to show the updated status
        fetchParticipants(tournamentId); 
    } catch (err) {
        console.error(`Error updating participant ${participantId} status to ${newStatus}:`, err);
        ElMessage.error(err.response?.data?.message || `Failed to update application status.`);
        participant.isUpdatingStatus = false; // Reset loading state on error
    } 
    // 'isUpdatingStatus' will be reset for this participant when fetchParticipants re-populates the list
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
            await apiClient.post(`/tournaments/${tournamentId}/register/team`, { team_id: authStore.user.team_id });
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

const isOrganizer = computed(() => {
    return authStore.isAuthenticated && tournament.value && authStore.userId === tournament.value.organizer_id;
});

const confirmDeleteTournament = () => {
    if (!tournament.value) return;
    if (window.confirm(`Are you sure you want to permanently delete the tournament "${tournament.value.name}"? This action cannot be undone.`)) {
        deleteTournament();
    }
};

const deleteTournament = async () => {
    if (!tournament.value || !isOrganizer.value) return; // Доп. проверка

    isDeletingTournament.value = true;
    errorMsg.value = ''; // Сбрасываем предыдущие ошибки страницы
    try {
        await apiClient.delete(`/tournaments/${tournament.value.id}`);
        ElMessage.success(`Tournament "${tournament.value.name}" deleted successfully.`);
        // Перенаправляем на список турниров
        router.push({ name: 'tournaments-list' }); 
    } catch (err) {
        console.error("Error deleting tournament:", err);
        // Отображаем ошибку на странице, а не только в ElMessage, если это критично
        errorMsg.value = err.response?.data?.message || 'Failed to delete tournament.';
        ElMessage.error(errorMsg.value);
    } finally {
        isDeletingTournament.value = false;
    }
};

// Функция для определения типа тега Element Plus для статуса участника
const getParticipantStatusTagType = (status) => {
    switch(status?.toLowerCase()){
        case 'application_submitted': return 'warning';
        case 'participant': return 'success'; // Или 'primary'
        case 'application_rejected': return 'danger';
        case 'cancelled': return 'info';
        default: return 'info';
    }
};

const getDisplayParticipantStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'application_submitted') return 'Submitted';
    if (s === 'application_rejected') return 'Rejected'; // Display "Rejected"
    if (s === 'participant') return 'Participant';
    if (s === 'cancelled') return 'Cancelled';
    // Capitalize other statuses or return as is
    return status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : 'Unknown';
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

// Определяем табы для CustomTabs
const tabItems = computed(() => [
  { name: 'about', label: 'About', icon: FilesIcon }, // Используем импортированную иконку FilesIcon
  { name: 'participants', label: 'Participants', icon: UserFilled, badgeContent: participantCount.value },
  { name: 'bracket', label: 'Bracket', icon: TrophyBase },
]);

// --- Modified Watchers ---
watch(() => props.id, 
    (newId, oldId) => {
        if (newId) {
            activeTab.value = 'about'; // Reset to "About"
            fetchTournamentDetails(newId);
            fetchParticipants(newId); 
            
            // Close WebSocket for the old tournament ID if it was active for the bracket
            if (oldId && socket.value) { // Check if socket existed for oldId
                closeWebSocket();
            }
            
            // Reset bracket data for the new tournament ID
            bracketData.value = null;
            bracketError.value = '';
            isLoadingBracket.value = false; 

            // If the active tab is already 'bracket' (e.g. page reloaded on bracket tab), setup WebSocket
            if (activeTab.value === 'bracket') {
                fetchBracketData(newId); // Initial fetch
                setupWebSocket(newId);   // Then setup WebSocket
            }
        } else {
            closeWebSocket(); // If props.id becomes null/undefined
        }
    }, 
    { immediate: true } 
);

watch(activeTab, (newTab, oldTab) => {
    if (newTab === 'participants' && props.id && (participants.value.length === 0 || participantsError.value) && !isLoadingParticipants.value) {
        fetchParticipants(props.id);
    }
    
    if (newTab === 'bracket' && props.id) {
        if (!bracketData.value || bracketError.value) { // Fetch initial data if not present or errored
            fetchBracketData(props.id);
        }
        setupWebSocket(props.id); // Setup WebSocket when bracket tab is active
    } else if (oldTab === 'bracket') {
        closeWebSocket(); // Close WebSocket when navigating away from bracket tab
    }
});

onMounted(() => {
    if (metaStore.sports.length === 0 && !metaStore.sportsLoading) metaStore.fetchSports();
    if (metaStore.formats.length === 0 && !metaStore.formatsLoading) metaStore.fetchFormats();
});

onUnmounted(() => {
  closeWebSocket(); // Ensure WebSocket is closed when component is destroyed
});
</script>

<style>
.el-empty {
  --el-empty-padding: 40px 0;
  --el-empty-image-width: 160px;
  --el-empty-description-margin-top: 20px;
  --el-empty-bottom-margin-top: 20px;
  --el-empty-fill-color-0: var(--el-color-white);
  --el-empty-fill-color-1: #cccccd;
  --el-empty-fill-color-2: #cccccd;
  --el-empty-fill-color-3: #a0a0a0;
  --el-empty-fill-color-4: #eeeff3;
  --el-empty-fill-color-5: #eeeff3;
  --el-empty-fill-color-6: #e9ebef;
  --el-empty-fill-color-7: #a0a0a0;
  --el-empty-fill-color-8: #e0e3e9;
  --el-empty-fill-color-9: #a0a0a0;
}
.el-result__title p {
    color: white !important;
    font-size: var(--el-result-title-font-size);
    line-height: 1.3;
    margin: 0;
}
.el-button--danger {
    --el-button-bg-color: var(--color-myred);
    --el-button-border-color: var(--color-myred);
    --el-button-outline-color: var(--color-myred);
    --el-button-active-color: var(--color-myred);
    --el-button-hover-bg-color: var(--color-myreddarker);
    --el-button-hover-border-color: var(--color-myred);
    --el-button-active-bg-color: var(--color-myred);
    --el-button-active-border-color: var(--color-myred);
    --el-button-disabled-text-color: var(--el-color-white);
    --el-button-disabled-bg-color: var(--el-color-danger-light-5);
    --el-button-disabled-border-color: var(--el-color-danger-light-5);
}
</style>
