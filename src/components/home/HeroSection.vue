<template>
  <main class="flex-1 py-8">

    <section ref="heroSectionRef" class="hero-section rounded-3xl text-[var(--color-text-light)] py-10 md:py-16 relative overflow-hidden">
      <div class="sky" ref="skyRef">
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div class="sky-level"></div>
        <div id="stars" class="sky-stars"></div>
      </div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl mb-4 font-['Jaro']">Find Your Next Challenge</h1>
          <p class="text-lg md:text-xl text-[var(--color-text-muted)] mb-8">
            Discover, compete, and conquer in tournaments across various eSports and traditional sports.
          </p>
          <router-link :to="{ name: 'tournaments-list' }">
            <button class="mobile-jaro bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] text-[var(--color-text-light)] py-3 px-8 rounded-lg text-xl transition duration-300">
              Browse All Tournaments
            </button>
          </router-link>
        </div>

        <div class="mb-10">
          <h2 class="text-2xl md:text-3xl text-center mb-6 md:mb-8">Explore by Sport</h2>
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

    <!-- Активные турниры -->
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
          <!-- {/* Отображаем через TournamentCard, передаем sportsMap из store */} -->
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
      <!-- <div class=" px-5 pt-6 dark:bg-primary dark:text-light rounded-3xl poppins">
        <div class="hidden py-2 xl:col-span-3 lg:col-span-4 md:hidden lg:block poppins">
          <div class="mb-8 space-x-5 border-b-2 border-opacity-10 dark:border-myred">
            <button
              type="button"
              class="pb-5 text-md font-semibold border-b-2 dark:border-myred poppins"
            >
              Latest
            </button>
            <button
              type="button"
              class="pb-5 text-md font-semibold border-b-2 dark:border- dark:text-gray-400"
            >
              Popular
            </button>
          </div>
          <div class="flex flex-col divide-y dark:divide-myreddarker">
            <div class="flex px-1 py-1">
              <img
                alt=""
                class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-secondary rounded-xl"
                src="/src/assets/snowflake.png"
              />
              <div class="flex flex-col flex-grow">
                <a rel="noopener noreferrer" href="#" class="hover:underline font-semibold">Vitality vs Falcons</a>
                <p class="muted-text pb-2">IEM Melbourne 2025 IEM Melbourne 2025 IEM Melbourne 2025</p>
                <p class="mt-auto text-xs dark:text-gray-400">
                  5 minutes ago
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    class="block dark:text-myreddarker lg:ml-2 lg:inline hover:underline"
                    >Politics</a
                  >
                </p>
              </div>
            </div>
            <div class="flex px-1 py-4">
              <img
                alt=""
                class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-secondary rounded-xl"
                src="/src/assets/snowflake.png"
              />
              <div class="flex flex-col flex-grow">
                <a rel="noopener noreferrer" href="#" class="hover:underline">Vitality vs Falcons</a>
                <p class="muted-text pb-2">IEM Melbourne 2025 IEM Melbourne 2025 IEM Melbourne 2025</p>
                <p class="mt-auto text-xs dark:text-gray-400">
                  14 minutes ago
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    class="block dark:text-myreddarker lg:ml-2 lg:inline hover:underline"
                    >Sports</a
                  >
                </p>
              </div>
            </div>
            <div class="flex px-1 py-4">
              <img
                alt=""
                class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-secondary rounded-xl"
                src="/src/assets/snowflake.png"
              />
              <div class="flex flex-col flex-grow">
                <a rel="noopener noreferrer" href="#" class="hover:underline">Vitality vs Falcons</a>
                <p class="muted-text pb-2">IEM Melbourne 2025 IEM Melbourne 2025 IEM Melbourne 2025</p>
                <p class="mt-auto text-xs dark:text-gray-400">
                  22 minutes ago
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    class="block dark:text-myreddarker lg:ml-2 lg:inline hover:underline"
                    >World</a
                  >
                </p>
              </div>
            </div>
            <div class="flex px-1 py-4">
              <img
                alt=""
                class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-secondary rounded-xl"
                src="/src/assets/snowflake.png"
              />
              <div class="flex flex-col flex-grow">
                <a rel="noopener noreferrer" href="#" class="hover:underline">Vitality vs Falcons</a>
                <p class="muted-text pb-2">IEM Melbourne 2025 IEM Melbourne 2025 IEM Melbourne 2025</p>
                <p class="mt-auto text-xs dark:text-gray-400">
                  37 minutes ago
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    class="block dark:text-myreddarker lg:ml-2 lg:inline hover:underline"
                    >Business</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end pb-6">
          <button class="poppins bg-myred text-white text-sm px-4 py-2 md:px-6 rounded-xl hover:bg-myreddarker font-bold whitespace-nowrap">
        More
      </button>
        </div>
      </div> -->
    </div>


    <section class="container mx-auto px-4">
      <div class="mx-auto py-8 sm:px-6 lg:px-2 h-full">
        <!-- Added h-full -->
        <div
          class="relative isolate overflow-hidden bg-primary px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 h-full min-h-[50vh]"
        >
          <!-- Added h-full and min-h-[80vh] -->

          <!-- Bigger SVG Background -->
          <svg
            viewBox="0 0 1024 1024"
            class="animate-pulse absolute top-1/2 left-1/2 -z-10 size-[80rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle
              cx="512"
              cy="512"
              r="512"
              fill="url(#759c1415-0410-454c-8f7c-9a820de03642)"
              fill-opacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03642">
                <stop stop-color="#de2424" />
                <stop offset="1" stop-color="#f00c0c" />
              </radialGradient>
            </defs>
          </svg>

          <div class="container px-6 py-8 mx-auto">
            <div
              class="flex flex-col items-center justify-center space-y-8 lg:-mx-4 lg:flex-row lg:items-stretch lg:space-y-0"
            >
              <div
                class="flex flex-col w-full max-w-sm p-8 space-y-8 text-center border-2 border-gray-200 rounded-lg lg:mx-4 bg-secondary dark:border-myred"
              >
                <div class="flex-shrink-0">
                  <h2
                    class="inline-flex items-center justify-center px-2 jersey-small tracking-wide text-myred text-3xl rounded-lg bg-primary"
                  >
                    heartbit
                  </h2>
                </div>

                <div class="flex-shrink-0">
                  <span class="pt-2 text-3xl font-bold text-gray-800 uppercase dark:text-gray-100">
                    Free
                  </span>
                </div>

                <ul class="flex-1 space-y-4">
                  <li class="text-gray-500 dark:text-gray-400">Grants Player Role</li>

                  <li class="text-gray-500 dark:text-gray-400">Allows to Create and Join Teams</li>

                  <li class="text-gray-500 dark:text-gray-400">Allows to Play on Tournaments</li>
                </ul>
              </div>

              <div
                class="flex flex-col w-full max-w-sm items-center p-8 space-y-8 text-center bg-white border-2 border-gray-200 rounded-lg lg:mx-4 dark:bg-secondary dark:border-myred"
              >
                <div class="flex-shrink-0">
                  <h2
                    class="inline-flex items-center justify-center px-2 jersey-small tracking-wide text-myred text-3xl rounded-lg bg-primary"
                  >
                    heartbit+
                  </h2>
                </div>

                <div class="flex-shrink-0">
                  <span class="pt-2 text-3xl font-bold text-gray-800 uppercase dark:text-gray-100">
                    $4.90
                  </span>

                  <span class="text-gray-500 dark:text-gray-400"> /month </span>
                </div>

                <ul class="flex-1 space-y-4">
                  <li class="text-gray-500 dark:text-gray-400">Grants Organizer Role</li>

                  <li class="text-gray-500 dark:text-gray-400">Custom Profile</li>

                  <li class="text-gray-500 dark:text-gray-400">Animated Avatar</li>

                  <li class="text-gray-500 dark:text-gray-400">Application Couldn't Be Rejected</li>
                </ul>

                <button
                  class="w-1/3 inline-flex items-center justify-center px-4 py-2 font-medium text-white uppercase bg-myred rounded-lg focus:outline-none transform hover:bg-myreddarker transition-transform duration-200"
                >
                  Get
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TournamentCard from '@/components/cards/TournamentCard.vue'
import { useMetaStore } from '@/stores/metaStore' // Используем metaStore
import apiClient from '@/services/apiClient' // Нужен для API вызова

const metaStore = useMetaStore() // Инициализируем store

const liveTournaments = ref([])
const isLoadingLiveTournaments = ref(false) // Renamed for clarity
const errorMsgLiveTournaments = ref('') // Renamed for clarity

const skyRef = ref(null); // Ref for the .sky element

// JS variables for sky animation (must match CSS)
const jsTransitionLayers = 40;
const jsDots = 12;
const jsLgStars = 2;
const jsSmStars = 3;

// Функция загрузки "живых" турниров
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
  // Fetch live tournaments first
  await fetchLiveTournaments(); 
  
  // Then fetch sports if not already loaded
  if (!metaStore.sports || metaStore.sports.length === 0) {
    await metaStore.fetchSports(); 
  }

  // Sky Animation JavaScript
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
      // We typically don't want to add these to the very last (largest) sky-level
      // as it's meant to be a solid backdrop. The original SCSS also implied this.
      // Adjust 'skyLevels.length -1' if you want a different behavior.
      if (index < skyLevels.length -1) { 
        let levelDivsHTML = '';
        for (let j = 0; j < jsTransitionLayers; j++) {
          // SCSS: $p: ceil(20 / $transition); $r: $p * ($transition - $j + 1);
          // Simplified logic for random width and margin:
          const randomWidth = Math.random() * 5 + 4; // Random width between 5% and 20%
          const randomMarginLeft = Math.random() * 20; // Random margin-left between 0% and 20%
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
/* Styles for the Hero Section itself */
.hero-section {
  /* background-color: var(--color-primary); Now handled by the sky or transparent */
  position: relative; /* Needed for absolute positioning of .sky */
  overflow: hidden; /* To contain the sky if it overflows */
}

/* Sky Animation CSS (Converted from SCSS) */
/* It's better to place this in a global CSS file if html, body styles are needed,
   or adapt them carefully. For this example, I'm scoping and adapting. */

.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Behind the hero content */
}

.sky-level {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

/* Manually expanded from SCSS @for loop for $levels = 6 */
.sky-level:nth-child(1) {
  padding-top: 16.6667vh; /* 100/6 * 1 */
  height: 16.6667vh;
  background-color: #171e28; /* nth($level-colors, 1) */
  z-index: 5; /* $levels - 1 */
}
.sky-level:nth-child(2) {
  padding-top: 33.3333vh; /* 100/6 * 2 */
  height: 33.3333vh;
  background-color: #171e28; /* nth($level-colors, 2) */
  z-index: 4; /* $levels - 2 */
}
.sky-level:nth-child(3) {
  padding-top: 50vh;    /* 100/6 * 3 */
  height: 50vh;
  background-color: #171e28; /* nth($level-colors, 3) */
  z-index: 3; /* $levels - 3 */
}
.sky-level:nth-child(4) {
  padding-top: 66.6667vh; /* 100/6 * 4 */
  height: 66.6667vh;
  background-color: #171e28; /* nth($level-colors, 4) */
  z-index: 2; /* $levels - 4 */
}
.sky-level:nth-child(5) {
  padding-top: 83.3333vh; /* 100/6 * 5 */
  height: 83.3333vh;
  background-color: #171e28; /* nth($level-colors, 5) */
  z-index: 1; /* $levels - 5 */
}
.sky-level:nth-child(6) {
  padding-top: 100vh;   /* 100/6 * 6 */
  height: 100vh;
  background-color: #171e28; /* nth($level-colors, 6) */
  z-index: 0; /* $levels - 6 */
}

/* The SCSS random() for sky-level div widths/margins is omitted for CSS simplicity.
   If this visual detail is crucial, the JS part would need to be extended
   to randomize these properties on the divs it creates (if it creates them).
   The provided JS for sky-level divs was minimal.
*/
.sky-level div { /* Basic styling for the transition divs if JS creates them */
  float: left;
  height: 4px; /* $px */
  background: #0f131a; /* Will inherit color from parent .sky-level */
  /* Example of a non-random width/margin if needed:
  width: 10%;
  margin-left: 5%;
  */
}


.sky-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6; /* $levels + 1 (relative to sky-level z-indices) */
}

.dot {
  position: absolute;
  width: 4px; /* $px */
  height: 4px; /* $px */
  background: #962b2b; /* $star-color */
}

.dot--blinking {
  animation: blink 0.25s linear infinite;
}

.star {
  position: absolute;
  color: #962b2b; /* $star-color */
  animation: scaleStar 1.5s linear infinite; /* Renamed to avoid conflict if 'scale' is a common utility class */
}

.star--sm {
  width: 28px; /* $sm-star */
  height: 28px; /* $sm-star */
}

.star--lg {
  width: 48px; /* $lg-star */
  height: 48px; /* $lg-star */
}

.star::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: currentColor;
  animation: growStar 1.5s linear infinite; /* Renamed */
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

@keyframes scaleStar { /* Renamed from 'scale' */
  0%, 16.4%,
  83.6%, 100% {
    transform: scale(.75, .75);
  }
  16.5%, 33%,
  66.6%, 83.5% {
    transform: scale(1, 1);
  }
}

@keyframes growStar { /* Renamed from 'grow' */
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
