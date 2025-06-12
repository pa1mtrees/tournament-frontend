<template>
  <main class="flex-1 py-8">

    <section ref="heroSectionRef" class="hero-section rounded-3xl text-[var(--color-text-light)] md:py-16 relative overflow-hidden">
      <div class="sky hidden sm:block" ref="skyRef">
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div id="stars" class="sky-stars"></div>
      </div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center md:mb-12">
          <h1 class="text-4xl md:text-6xl mb-4 mt-8 font-['Jaro']">Find Your Next Challenge</h1>
          <p class="text-md md:text-xl text-[var(--color-text-muted)] mb-4 md:mb-8">
            Discover, compete, and conquer in tournaments across various eSports and traditional sports.
          </p>
          <router-link :to="{ name: 'tournaments-list' }">
            <button class="mobile-jaro bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] text-[var(--color-text-light)] py-3 px-8 rounded-lg text-xl transition duration-300">
              Browse All Tournaments
            </button>
          </router-link>
        </div>

        <div class="mb-10">
          <h2 class="text-2xl md:text-3xl text-center mb-2 mt-2 md:mb-8">Explore by Sport</h2>
          <div v-if="metaStore.sportsLoading" class="text-center text-[var(--color-text-muted)]">
            Loading sports...
          </div>
          <div v-else-if="metaStore.sportsError" class="text-center text-red-500">
            Error loading sports: {{ metaStore.sportsError }}
          </div>
          <div v-else-if="metaStore.sports && metaStore.sports.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            <router-link
              v-for="sport in metaStore.sports"
              :key="sport.id"
              :to="{ name: 'tournaments-list', query: { sportId: sport.id } }"
              class="aspect-square rounded-3xl shadow-lg overflow-hidden relative group bg-center bg-cover bg-no-repeat transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-myred)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary)] block"
              :style="{ backgroundImage: `url(${sport.logo_url})` }"
              :aria-label="`View ${sport.name} tournaments`"
            >
              <div class="absolute inset-0 bg-black/60 group-hover:bg-black/80 transition-opacity duration-300 flex items-center justify-center p-2">
                <span class="text-white text-lg md:text-xl font-semibold text-center capitalize">{{ sport.name }}</span>
              </div>
            </router-link>
          </div>
          <div v-else class="text-center text-[var(--color-text-muted)]">
            No sports available at the moment.
          </div>
        </div>
      </div>
  </section>

    <div class="grid grid-cols-1">
      <div class="col-span-1 container mx-auto px-4 py-6">
        <div class="flex items-center space-x-1.5 mb-4">
          <svg height="50" width="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="text-myred animate-pulse" >
            <path d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0Zm12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415ZM9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0Zm6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414Zm-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z" fill="currentColor"/>
          </svg>
          <h2 class="text-4xl text-light">Live Tournaments</h2>
        </div>
        <div class="rounded-3xl">
          <div v-if="isLoading" class="text-center text-[var(--color-text-muted)]">Loading...</div>
          <div v-else-if="errorMsg" class="text-center text-red-500">{{ errorMsg }}</div>
          <div
            v-else-if="liveTournaments.length === 0"
            class="text-center text-[var(--color-text-muted)]"
          >
            No live tournaments currently.
          </div>
          <div v-else class="grid grid-cols-1 gap-6">
            <TournamentCard
              v-for="tournament in liveTournaments"
              :key="tournament.id"
              :tournament="tournament"
              :sports-map="metaStore.sportsMap"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TournamentCard from '@/components/cards/TournamentCard.vue'
import { useMetaStore } from '@/stores/metaStore'
import apiClient from '@/services/apiClient'

const metaStore = useMetaStore()

const liveTournaments = ref([])
const isLoadingLiveTournaments = ref(false)
const errorMsgLiveTournaments = ref('')

const skyRef = ref(null);

const jsTransitionLayers = 40;
const jsDots = 12;
const jsLgStars = 2;
const jsSmStars = 3;

const fetchLiveTournaments = async () => {
  isLoadingLiveTournaments.value = true
  errorMsgLiveTournaments.value = ''
  liveTournaments.value = []
  try {
    const response = await apiClient.get('/tournaments', {
      params: {
        status: 'active',
        limit: 4,
      },
    })
    liveTournaments.value = response.data?.tournaments || []
  } catch (err) {
    console.error('Error fetching live tournaments:', err)
    errorMsgLiveTournaments.value = 'Could not load live tournaments.'
  } finally {
    isLoadingLiveTournaments.value = false
  }
}

onMounted(async () => {
  await fetchLiveTournaments();

  if (!metaStore.sports || metaStore.sports.length === 0) {
    await metaStore.fetchSports();
  }

  if (skyRef.value) {
    function nJoin(n, markupFactory) {
      let result = '';
      for (let i = 0; i < n; i++) {
        result += markupFactory(i);
      }
      return result;
    }

    const skyLevels = skyRef.value.querySelectorAll('.sky-level');
    skyLevels.forEach((layer, index) => {
      if (index < skyLevels.length -1) {
        let levelDivsHTML = '';
        for (let j = 0; j < jsTransitionLayers; j++) {
          const randomWidth = Math.random() * 5 + 4;
          const randomMarginLeft = Math.random() * 20;
          levelDivsHTML += `<div style="width: ${randomWidth}%; margin-left: ${randomMarginLeft}%;"></div>`;
        }
        layer.innerHTML = levelDivsHTML;
      }
    });

    const starsContainer = skyRef.value.querySelector('#stars');
    if (starsContainer) {
      const bigStarsHTML = nJoin(jsLgStars, () => `
        <span class="star star--lg" style="top: ${Math.random() * 60}%; left: ${Math.random() * 80}%;">
          <span class="star__part"></span>
          <span class="star__part"></span>
        </span>
      `);

      const smallStarsHTML = nJoin(jsSmStars, () => `
        <span class="star star--sm" style="top: ${Math.random() * 80}%; left: ${Math.random() * 90}%;">
          <span class="star__part"></span>
          <span class="star__part"></span>
        </span>
      `);

      const dotStarsHTML = nJoin(jsDots, () => {
        const isBlinking = Math.random() < 0.33;
        const className = `dot ${isBlinking ? 'dot--blinking' : ''}`;
        return `
          <span class="${className}" style="top: ${Math.random() * 90}%; left: ${Math.random() * 100}%;"></span>
        `;
      });
      starsContainer.innerHTML = dotStarsHTML + smallStarsHTML + bigStarsHTML;
    }
  }
});
</script>

<style>
.hero-section {
  position: relative;
  overflow: hidden;
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.sky-level {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.sky-level:nth-child(1) {
  padding-top: 16.6667vh;
  height: 16.6667vh;
  background-color: #171e28;
  z-index: 5;
}
.sky-level:nth-child(2) {
  padding-top: 33.3333vh;
  height: 33.3333vh;
  background-color: #171e28;
  z-index: 4;
}
.sky-level:nth-child(3) {
  padding-top: 50vh;
  height: 50vh;
  background-color: #171e28;
  z-index: 3;
}
.sky-level:nth-child(4) {
  padding-top: 66.6667vh;
  height: 66.6667vh;
  background-color: #171e28;
  z-index: 2;
}
.sky-level:nth-child(5) {
  padding-top: 83.3333vh;
  height: 83.3333vh;
  background-color: #171e28;
  z-index: 1;
}
.sky-level:nth-child(6) {
  padding-top: 100vh;
  height: 100vh;
  background-color: #171e28;
  z-index: 0;
}

.sky-level div {
  float: left;
  height: 4px;
  background: #0f131a;
}

.sky-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
}

.dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #962b2b;
}

.dot--blinking {
  animation: blink 0.25s linear infinite;
}

.star {
  position: absolute;
  color: #962b2b;
  animation: scaleStar 1.5s linear infinite;
}

.star--sm {
  width: 28px;
  height: 28px;
}

.star--lg {
  width: 48px;
  height: 48px;
}

.star::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: currentColor;
  animation: growStar 1.5s linear infinite;
}

.star__part {
  position: absolute;
  background: currentColor;
}

.star__part:nth-child(1) {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 20%;
}

.star__part:nth-child(2) {
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 20%;
  height: 100%;
}

@keyframes blink {
  0%, 32%, 67% {
    opacity: 1;
  }
  33%, 66% {
    opacity: 0;
  }
}

@keyframes scaleStar {
  0%, 16.4%,
  83.6%, 100% {
    transform: scale(.75, .75);
  }
  16.5%, 33%,
  66.6%, 83.5% {
    transform: scale(1, 1);
  }
}

@keyframes growStar {
  0%, 16.4%,
  83.6%, 100% {
    width: 20%;
    height: 20%;
  }
  16.5%, 33%,
  66.6%, 83.5% {
    width: 50%;
    height: 50%;
  }
  33.1%, 50%, 66.5% {
    width: 100%;
    height: 100%;
  }
}
</style>
