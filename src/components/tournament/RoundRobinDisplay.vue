<template>
  <div v-if="loading" class="text-center py-10">
    <el-skeleton :rows="5" animated />
  </div>
  <div v-else-if="!bracketData || (!bracketData.standings && !bracketData.matches)" class="text-center py-10">
    <el-empty description="Round Robin data is not available or incomplete." :image-size="100" />
  </div>
  <div v-else class="round-robin-display space-y-8">
    <section v-if="bracketData.standings && bracketData.standings.length > 0">
      <h2 class="text-2xl text-[var(--color-text-light)] mb-4">Standings</h2>
      <div class="overflow-x-auto bg-[var(--color-secondary)] p-3 sm:p-4 rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-800/30">
            <tr>
              <th scope="col" class="px-3 py-2.5 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Rank</th>
              <th scope="col" class="px-3 py-2.5 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Participant</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Pld</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Pts</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">W</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">D</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">L</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">SF</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">SA</th>
              <th scope="col" class="px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">SD</th>
            </tr>
          </thead>
          <tbody class="bg-[var(--color-secondary)] divide-y divide-gray-700/50">
            <tr v-for="entry in sortedStandings" :key="entry.participant.participant_db_id" class="hover:bg-gray-700/20">
              <td class="px-3 py-3 whitespace-nowrap text-sm font-medium text-[var(--color-text-light)] text-center sm:text-left">{{ entry.rank }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-[var(--color-text-light)]">
                <div class="flex items-center space-x-2">
                  <img :src="getParticipantAvatar(entry.participant)" :alt="entry.participant.name" class="w-6 h-6 rounded-sm object-cover flex-shrink-0">
                  <span class="truncate" :title="entry.participant.name">{{ entry.participant.name }}</span>
                </div>
              </td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center text-[var(--color-text-light)]">{{ entry.games_played }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center font-semibold text-[var(--color-text-light)]">{{ entry.points }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center text-green-400">{{ entry.wins }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center text-yellow-400">{{ entry.draws }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center text-red-400">{{ entry.losses }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center text-[var(--color-text-light)] hidden sm:table-cell">{{ entry.score_for }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center text-[var(--color-text-light)] hidden sm:table-cell">{{ entry.score_against }}</td>
              <td class="px-3 py-3 whitespace-nowrap text-sm text-center text-[var(--color-text-light)] hidden md:table-cell">{{ entry.score_difference }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
     <div v-else-if="!loading" class="text-center py-6">
        <el-empty description="Standings are not available yet." :image-size="80"></el-empty>
    </div>

    <section v-if="groupedMatches && Object.keys(groupedMatches).length > 0">
      <h2 class="text-2xl text-[var(--color-text-light)] mb-4">Matches</h2>
      <div v-for="(matchesInRound, roundNum) in groupedMatches" :key="`round-${roundNum}`" class="mb-6">
        <h3 class="text-lg font-medium text-[var(--color-text-muted)] mb-3 border-b border-gray-700 pb-1">Round {{ roundNum }}</h3>
        <div class="space-y-3">
          <div v-for="match in matchesInRound" :key="match.bracket_match_uid || match.match_id"
               class="bg-[var(--color-secondary)] p-3 sm:p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div class="flex-grow w-full">
                <div class="flex justify-between items-center mb-1.5">
                  <div class="flex items-center space-x-2 overflow-hidden min-w-0">
                    <img :src="getParticipantAvatar(match.participant1)" :alt="match.participant1?.name || 'P1'" class="w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-cover flex-shrink-0">
                    <span class="font-semibold text-sm sm:text-base truncate text-[var(--color-text-light)]" :title="match.participant1?.name">{{ match.participant1?.name || 'TBD' }}</span>
                  </div>
                  <span class="text-sm sm:text-base font-bold text-[var(--color-text-light)] ml-2 px-1.5 py-0.5 rounded bg-gray-700/50">
                    {{ match.score_p1 !== undefined ? match.score_p1 : (match.participant1 ? '-' : '') }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2 overflow-hidden min-w-0">
                    <img :src="getParticipantAvatar(match.participant2)" :alt="match.participant2?.name || 'P2'" class="w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-cover flex-shrink-0">
                    <span class="font-semibold text-sm sm:text-base truncate text-[var(--color-text-light)]" :title="match.participant2?.name">{{ match.participant2?.name || 'TBD' }}</span>
                  </div>
                  <span class="text-sm sm:text-base font-bold text-[var(--color-text-light)] ml-2 px-1.5 py-0.5 rounded bg-gray-700/50">
                    {{ match.score_p2 !== undefined ? match.score_p2 : (match.participant2 ? '-' : '') }}
                  </span>
                </div>
              </div>
              <div class="flex-shrink-0 text-xs sm:text-sm text-left sm:text-right sm:ml-4 w-full sm:w-auto mt-2 sm:mt-0">
                <div :class="getStatusClass(match.status)" class="px-2 py-1 rounded-full inline-block mb-1 text-center shadow-sm">
                  {{ formatMatchStatus(match.status) }}
                </div>
                <div v-if="match.match_time && (match.status === 'scheduled' || match.status === 'in_progress')" class="text-[var(--color-text-muted)] mt-1">
                  {{ formatMatchTime(match.match_time) }}
                </div>
                <div v-if="match.is_draw && (match.status === 'completed' || match.status === 'finished')" class="text-yellow-400 font-semibold mt-1">Match Drawn</div>
                <div v-else-if="match.winner_participant_db_id && (match.status === 'completed' || match.status === 'finished')" class="text-green-400 font-semibold mt-1">
                  Winner: {{ getWinnerName(match) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div v-else-if="!loading && bracketData.matches && bracketData.matches.length === 0" class="text-center py-6">
        <el-empty description="No matches scheduled yet for this tournament." :image-size="80"></el-empty>
    </div>

  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { ElSkeleton, ElEmpty } from 'element-plus';

const props = defineProps({
  bracketData: {
    type: Object,
    default: () => null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  getAvatarForBracketParticipant: {
    type: Function,
    required: true
  },
  formatMatchTimeForDisplay: {
    type: Function,
    required: true
  }
});

const sortedStandings = computed(() => {
  if (!props.bracketData || !props.bracketData.standings) return [];
  // Sort by rank, then by points (desc), then by score difference (desc), then by name
  return [...props.bracketData.standings].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (b.points !== a.points) return b.points - a.points;
    if (b.score_difference !== a.score_difference) return b.score_difference - a.score_difference;
    return a.participant.name.localeCompare(b.participant.name);
  });
});

const groupedMatches = computed(() => {
  if (!props.bracketData || !props.bracketData.matches) return {};
  const matches = props.bracketData.matches.reduce((acc, match) => {
    const round = match.round || 0;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {});

  const sortedRounds = {};
  Object.keys(matches)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(roundNum => {
      sortedRounds[roundNum] = matches[roundNum].sort((a,b) => a.order_in_round - b.order_in_round);
    });
  return sortedRounds;
});

const getParticipantAvatar = (participantInfo) => {
  if (!participantInfo) return '';
  return props.getAvatarForBracketParticipant(participantInfo);
};

const formatMatchTime = (dateTimeString) => {
  if (!dateTimeString) return 'TBD';
  return props.formatMatchTimeForDisplay(dateTimeString);
};

const formatMatchStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled': return 'bg-blue-600 text-white text-xs font-medium';
    case 'in_progress': return 'bg-yellow-500 text-black text-xs font-medium';
    case 'completed': case 'finished': return 'bg-green-600 text-white text-xs font-medium';
    case 'canceled': return 'bg-red-600 text-white text-xs font-medium';
    default: return 'bg-gray-500 text-white text-xs font-medium';
  }
};

const getWinnerName = (match) => {
  if (!match.winner_participant_db_id || !props.bracketData.participants_map) return 'N/A';
  const winnerInfo = props.bracketData.participants_map[String(match.winner_participant_db_id)];
  return winnerInfo ? winnerInfo.name : 'N/A';
};

</script>

<style scoped>
.round-robin-display th, .round-robin-display td {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
@media (min-width: 640px) {
  .round-robin-display th, .round-robin-display td {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
