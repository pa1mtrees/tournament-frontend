<template>
  <div class="space-y-8">
    <div
      v-if="user"
      class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
    >
      <div class="flex-shrink-0">
        <img
          v-if="displayAvatar"
          :src="displayAvatar"
          alt="User Avatar"
          class="w-40 h-40 object-cover rounded-xl"
        />
        <div
          v-else
          class="w-24 h-24 rounded-xl bg-[var(--color-secondary)] border-2 border-[var(--color-text-light)] flex items-center justify-center text-4xl text-[var(--color-text-light)] font-bold"
        >
          {{ (user.nickname || user.first_name || '?').charAt(0).toUpperCase() }}
        </div>
      </div>
      <div class="text-center sm:text-left flex-grow ">
        <h2 class="text-2xl text-[var(--color-text-light)] mb-2">
          {{ user.first_name }} {{ user.last_name }}
          <span v-if="user.nickname" class="text-lg mobile-jaro text-[var(--color-text-muted)]">
            ({{ user.nickname }})</span
          >
        </h2>
        <p class="text-sm text-[var(--color-text-muted)]">{{ user.email }}</p>
        <p v-if="user.role" class="text-sm text-[var(--color-text-muted)] capitalize mt-1">
          Role: {{ user.role }}
        </p>
        <p v-if="user.created_at" class="align-bottom text-xs text-[var(--color-text-muted)] mt-2">
          Joined: {{ formattedUserJoinDate }}
        </p>
      </div>
        <div v-if="isOwnProfile" class="sm:ml-auto flex-shrink-0"> 
          <button 
            @click="$emit('openEditProfile')" 
            class="inline-block poppins bg-[var(--color-myred)] text-[var(--color-text-light)] hover:bg-[var(--color-myreddarker)] px-5 py-2 rounded-[0.7vw] text-sm font-medium"
          >
            Edit Profile 
          </button> 
        </div> 
    </div>
    <div v-else class="text-center poppins text-[var(--color-text-muted)]">
      Loading profile data...
    </div>

    <div v-if="user" class="space-y-4">
      <div class="flex justify-between poppins items-center gap-4">
        <h3 class="text-4xl font-['Jaro'] text-[var(--color-text-light)]">
          {{ isOwnProfile ? 'My' : `${user.first_name || 'User'}'s` }} Team
        </h3>
        <slot name="additional-team-header-actions"></slot>
      </div>

      <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg">
        <div v-if="user.team_id">
          <div v-if="isLoadingMembers" class="text-center text-[var(--color-text-muted)]">
            Loading members...
          </div>
          <div v-else-if="membersError" class="text-center text-red-500">{{ membersError }}</div>
          <table
            v-else-if="teamMembers && teamMembers.length > 0"
            class="w-full table-auto border-collapse border border-[var(--color-secondary)]"
          >
            <thead class="bg-[var(--color-secondary)] text-left">
              <tr>
                <th class="p-3 text-[var(--color-text-light)] font-medium">
                  <div class="flex text-center items-center space-x-2">
                    <img
                      v-if="user.team?.logo_url"
                      :src="user.team.logo_url"
                      alt="Team Logo"
                      class="w-16 h-16 rounded-md bg-[var(--color-secondary)]"
                    />
                    <h1 class="text-2xl text-[var(--color-text-light)]">{{ user.team?.name || '...' }}</h1>
                  </div>
                </th>
                <th class="text-xl font-['Jaro'] p-3 text-[var(--color-text-light)] font-light text-right">Role</th>
                <th
                  v-if="isOwnProfileAndCaptain"
                  class="text-xl font-['Jaro'] p-3 text-[var(--color-text-light)] font-light text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in teamMembers"
                :key="member.id"
                class="border-t border-[var(--color-secondary)]"
              >
                <td class="p-3">
                  <div class="flex items-center space-x-3">
                    <img
                      :src="
                        member.logo_url ||
                        `https://api.dicebear.com/8.x/identicon/svg?seed=${member.first_name || member.id}`
                      "
                      alt="Avatar"
                      class="w-14 h-14 object-cover flex-shrink-0 rounded-lg"
                    />
                    <div class="flex-grow">
                      <router-link
                        :to="{ name: 'user-profile', params: { id: member.id } }"
                        class="font-medium text-[var(--color-text-light)] hover:text-[var(--color-myyellow)]"
                      >
                        {{ member.first_name }} {{ member.last_name }}
                        <span v-if="member.nickname" class="text-sm text-[var(--color-text-muted)]"
                          >({{ member.nickname }})</span
                        >
                      </router-link>
                      <p class="text-xs text-[var(--color-text-muted)]">{{ member.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-3 text-sm text-right">
                  <span
                    v-if="user.team?.captain_id === member.id"
                    class="font-bold text-[var(--color-myred)]"
                    >Captain</span
                  >
                  <span v-else class="text-[var(--color-text-muted)] capitalize">{{
                    member.role
                  }}</span>
                </td>
                <td v-if="isOwnProfileAndCaptain" class="p-3 text-right">
                  <button
                    v-if="member.id !== currentUserId"
                    @click="$emit('requestRemoveMember', member)"
                    title="Remove Member"
                    class="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                    :disabled="isRemovingMemberId === member.id"
                  >
                    <span v-if="isRemovingMemberId === member.id">...</span>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center text-[var(--color-text-muted)]">
            Team has no members listed or members could not be loaded.
          </div>

          <div v-if="isOwnProfile" class="mt-4 pt-4 border-t border-[var(--color-secondary)]">
            <slot name="team-actions"></slot>
          </div>
        </div>
        <div v-else class="text-center text-[var(--color-text-muted)]">
          {{
            isOwnProfile ? 'Not in a team yet.' : `${user.first_name || 'User'} is not in a team.`
          }}
          <div v-if="isOwnProfile" class="mt-4"><slot name="create-team-action"></slot></div>
        </div>
      </div>
    </div>

    <div v-if="user" class="space-y-4">
      <h3 class="text-4xl text-[var(--color-text-light)]">
        {{ isOwnProfile ? 'My' : `${user.first_name}'s` }} Organized Tournaments
      </h3>
      <div v-if="isLoadingOrganizedTournaments" class="text-center text-[var(--color-text-muted)]">
        Loading tournaments...
      </div>
      <div v-else-if="organizedTournamentsError" class="text-center text-red-500">
        {{ organizedTournamentsError }}
      </div>
      <div
        v-else-if="organizedTournaments && organizedTournaments.length === 0"
        class="text-center text-[var(--color-text-muted)]"
      >
        <div class="space-y-6">
          <div>
            <div
              class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]"
            >
              <el-empty :image-size="120" description="No organized tournaments" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TournamentCard
          v-for="tournament in organizedTournaments"
          :key="tournament.id"
          :tournament="tournament"
        />
      </div>
    </div>

    <div v-if="user" class="space-y-6">
      <div>
        <h3 class="text-4xl text-[var(--color-text-light)] mb-4">
          {{ isOwnProfile ? 'My' : `${user.first_name}'s` }} Match History
        </h3>
        <div
          class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]"
        >
          <el-empty :image-size="120" description="No match history yet" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TournamentCard from '@/components/cards/TournamentCard.vue'
// Убедитесь, что ElEmpty импортирован глобально в main.js или локально здесь, если используете
// import { ElEmpty } from 'element-plus';
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const props = defineProps({
  user: { type: Object, default: null },
  isOwnProfile: { type: Boolean, default: false },
  isCaptain: { type: Boolean, default: false }, // Новый проп: является ли просматриваемый пользователь капитаном СВОЕЙ команды
  currentUserId: { type: [Number, String], default: null }, // ID залогиненного пользователя
  teamMembers: { type: Array, default: () => [] },
  isLoadingMembers: { type: Boolean, default: false },
  membersError: { type: String, default: '' },
  isRemovingMemberId: { type: [Number, String, null], default: null }, // Для индикатора загрузки удаления
  organizedTournaments: { type: Array, default: () => [] },
  isLoadingOrganizedTournaments: { type: Boolean, default: false },
  organizedTournamentsError: { type: String, default: '' },
})

defineEmits(['openEditProfile'])
const isOwnProfileAndCaptain = computed(() => props.isOwnProfile && props.isCaptain)

const displayAvatar = computed(() => {
    // 1. Используем logo_url из объекта props.user, если он есть (от бэкенда)
    if (props.user?.logo_url) { // Используем logo_url согласно вашему JSON
        return props.user.logo_url;
    }
    // 2. Если нет, генерируем Identicon
    if (props.user?.email || props.user?.id) { 
        const seed = props.user.nickname || props.user.first_name || props.user.email || props.user.id;
        return `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
    }
    return null; // Fallback
});

const formattedUserJoinDate = computed(() => {
  if (!props.user?.created_at) return ''
  try {
    return new Date(props.user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    return props.user.created_at
  }
})
</script>

<style scoped>
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
</style>
