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
            class="bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold transition duration-200 ease-in-out shadow-lg shadow-secondary/70 flex items-center"
          >
            Edit Profile
          </button>
        </div>
    </div>
    <div v-else class="text-center poppins text-[var(--color-text-muted)]">
      Loading profile data...
    </div>

    <div v-if="user" class="space-y-4">
      <div class="flex flex-col sm:flex-row justify-between poppins items-center gap-2 sm:gap-4 mb-4">
      <h3 class="text-3xl sm:text-4xl font-['Jaro'] text-[var(--color-text-light)] text-center sm:text-left">
        {{ isOwnProfile ? 'My' : `${user.first_name || 'User'}'s` }} Team
      </h3>
      <div class="w-full sm:w-auto">
        <slot name="additional-team-header-actions"></slot>
      </div>
      </div>

      <div class="bg-[var(--color-primary)] p-4 sm:p-6 rounded-[1vw] shadow-lg">
      <div v-if="user.team_id">
        <div v-if="isLoadingMembers" class="text-center text-[var(--color-text-muted)] py-4">
        Loading members...
        </div>
        <div v-else-if="membersError" class="text-center text-red-500 py-4">{{ membersError }}</div>
        <div v-else-if="teamMembers && teamMembers.length > 0">
        <div class="hidden sm:flex items-center justify-between mb-4 pb-2 border-b border-[var(--color-secondary)]">
          <router-link :to="`/team/${user.team_id}`" class="flex items-center space-x-3">
            <img
            v-if="user.team?.logo_url"
            :src="user.team.logo_url"
            alt="Team Logo"
            class="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-[var(--color-secondary)] object-cover"
            />
            <h1 class="text-xl sm:text-2xl text-[var(--color-text-light)]">{{ user.team?.name || 'Team Details' }}</h1>
          </router-link>
          <div v-if="isOwnProfileAndCaptain" class="text-sm text-[var(--color-text-muted)]">
          </div>
        </div>
        <div class="sm:hidden mb-4 text-center">
          <router-link :to="`/team/${user.team_id}`" class="inline-flex flex-col items-center space-y-2">
            <img
            v-if="user.team?.logo_url"
            :src="user.team.logo_url"
            alt="Team Logo"
            class="w-16 h-16 rounded-md bg-[var(--color-secondary)] object-cover"
            />
            <h1 class="text-xl text-[var(--color-text-light)]">{{ user.team?.name || 'Team Details' }}</h1>
          </router-link>
        </div>

        <div class="space-y-4">
          <div
          v-for="member in teamMembers"
          :key="member.id"
          class="bg-[var(--color-secondary)] p-3 rounded-lg sm:flex sm:items-center sm:justify-between sm:space-x-4 shadow"
          >
          <div class="flex items-center space-x-3 mb-3 sm:mb-0 sm:flex-grow">
            <img
            :src="
              member.logo_url ||
              `https://api.dicebear.com/8.x/identicon/svg?seed=${member.first_name || member.id}`
            "
            alt="Avatar"
            class="w-12 h-12 sm:w-14 sm:h-14 object-cover flex-shrink-0 rounded-lg"
            />
            <div class="flex-grow">
            <router-link
              :to="{ name: 'user-profile', params: { id: member.id } }"
              class="font-medium text-[var(--color-text-light)] hover:text-[var(--color-myred)] block text-sm sm:text-base"
            >
              {{ member.nickname || member.first_name + ' ' + member.last_name }}
              <span v-if="member.nickname && (member.first_name || member.last_name)" class="text-xs text-[var(--color-text-muted)] block sm:inline"
              >({{ member.first_name }} {{ member.last_name }})</span
              >
            </router-link>
            <p class="text-xs text-[var(--color-text-muted)]">{{ member.email }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <div class="text-xs sm:text-sm text-left sm:text-right w-full sm:w-auto">
            <span class="sm:hidden font-semibold text-[var(--color-text-light)]">Role: </span>
            <span
              v-if="user.team?.captain_id === member.id"
              class="font-bold text-[var(--color-myred)]"
              >Captain</span
            >
            <span v-else class="text-[var(--color-text-muted)] capitalize">{{
              member.role
            }}</span>
            </div>

            <div v-if="isOwnProfileAndCaptain && member.id !== currentUserId" class="w-full sm:w-auto text-left sm:text-right">
            <button
              @click="$emit('requestRemoveMember', member)"
              title="Remove Member"
              class="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 hover:scale-110 transition-transform duration-200 ease-in-out flex items-center text-xs sm:text-sm"
              :disabled="isRemovingMemberId === member.id"
            >
              <span v-if="isRemovingMemberId === member.id">...</span>
              <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:h-5 sm:w-5 mr-1"
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
              <span class="sm:hidden">Remove</span>
            </button>
            </div>
          </div>
          </div>
        </div>
        </div>
        <div v-else class="text-center text-[var(--color-text-muted)] py-4">
        Team has no members listed or members could not be loaded.
        </div>

        <div v-if="isOwnProfile" class="mt-4 pt-4 border-t border-[var(--color-secondary)]">
        <slot name="team-actions"></slot>
        </div>
      </div>
      <div v-else class="text-center text-[var(--color-text-muted)] py-6">
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
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const props = defineProps({
  user: { type: Object, default: null },
  isOwnProfile: { type: Boolean, default: false },
  isCaptain: { type: Boolean, default: false },
  currentUserId: { type: [Number, String], default: null },
  teamMembers: { type: Array, default: () => [] },
  isLoadingMembers: { type: Boolean, default: false },
  membersError: { type: String, default: '' },
  isRemovingMemberId: { type: [Number, String, null], default: null },
  organizedTournaments: { type: Array, default: () => [] },
  isLoadingOrganizedTournaments: { type: Boolean, default: false },
  organizedTournamentsError: { type: String, default: '' },
})

defineEmits(['openEditProfile'])
const isOwnProfileAndCaptain = computed(() => props.isOwnProfile && props.isCaptain)

const displayAvatar = computed(() => {
    if (props.user?.logo_url) {
        return props.user.logo_url;
    }
    if (props.user?.email || props.user?.id) {
        const seed = props.user.nickname || props.user.first_name || props.user.email || props.user.id;
        return `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
    }
    return null;
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
.el-message--success {
    --el-message-bg-color: #232f1c !important;
    --el-message-border-color: #092e05 !important;
    --el-message-text-color: #23ba35 !important;
}
</style>
