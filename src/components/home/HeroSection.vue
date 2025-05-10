<script setup>
import { ref, onMounted, computed } from 'vue'
import TournamentCard from '@/components/cards/TournamentCard.vue'
import { useMetaStore } from '@/stores/metaStore' // Используем metaStore
import apiClient from '@/services/apiClient' // Нужен для API вызова

const metaStore = useMetaStore() // Инициализируем store

const liveTournaments = ref([])
const isLoading = ref(false)
const errorMsg = ref('')

// Функция загрузки "живых" турниров
const fetchLiveTournaments = async () => {
  isLoading.value = true
  errorMsg.value = ''
  liveTournaments.value = []
  try {
    // Запрашиваем только активные турниры, например, первые 4
    const response = await apiClient.get('/tournaments', {
      params: {
        status: 'active', // Фильтр по статусу 'active'
        limit: 4,
      },
    })
    liveTournaments.value = response.data?.tournaments || []
  } catch (err) {
    console.error('Error fetching live tournaments:', err)
    errorMsg.value = 'Could not load live tournaments.'
  } finally {
    isLoading.value = false
  }
}

// Загружаем данные при монтировании
onMounted(() => {
  fetchLiveTournaments()
  metaStore.fetchSports() // Убедимся, что спорты загружены
})
</script>

<template>
  <main class="flex-1 py-8">
    <!-- Активные турниры -->
    <div class="grid grid-cols-3">
      <div class="col-span-2 container mx-auto px-4 py-6">
        <h2 class="text-4xl mb-8 text-light">🔴 Live Tournaments</h2>
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
      <div class=" px-5 pt-6 dark:bg-primary dark:text-light rounded-3xl poppins">
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
      </div>
    </div>
    <!-- <h1 class="text-2xl">News</h1>
    <div class="px-5 py-10 dark:bg-primary dark:text-light rounded-[0.7vw] poppins">
      <div class="hidden py-2 xl:col-span-3 lg:col-span-4 md:hidden lg:block poppins">
        <div class="mb-8 space-x-5 border-b-2 border-opacity-10 dark:border-myred">
          <button
            type="button"
            class="pb-5 text-sm font-bold uppercase border-b-2 dark:border-myred poppins"
          >
            Latest
          </button>
          <button
            type="button"
            class="pb-5 text-sm font-bold uppercase border-b-2 dark:border- dark:text-gray-400"
          >
            Popular
          </button>
        </div>
        <div class="flex flex-col divide-y dark:divide-myreddarker">
          <div class="flex px-1 py-4">
            <img
              alt=""
              class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-gray-500"
              src="https://source.unsplash.com/random/244x324"
            />
            <div class="flex flex-col flex-grow">
              <a rel="noopener noreferrer" href="#" class="hover:underline">Loh</a>
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
              class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-gray-500"
              src="https://source.unsplash.com/random/245x325"
            />
            <div class="flex flex-col flex-grow">
              <a rel="noopener noreferrer" href="#" class="hover:underline">Chmo</a>
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
              class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-gray-500"
              src="https://source.unsplash.com/random/246x326"
            />
            <div class="flex flex-col flex-grow">
              <a rel="noopener noreferrer" href="#" class="hover:underline">Bomzh</a>
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
              class="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-gray-500"
              src="https://source.unsplash.com/random/247x327"
            />
            <div class="flex flex-col flex-grow">
              <a rel="noopener noreferrer" href="#" class="hover:underline">SOso</a>
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
    </div> -->
    <!-- Как это работает -->
    <section class="py-12 bg-secondary">
      <div class="container mx-auto px-4">
        <h1 class="text-5xl mb-8 text-center text-white">How It Works?</h1>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <!-- Card 1 -->
          <div
            class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden"
          >
            <img
              src="/src/assets/users.svg"
              alt=""
              class="absolute p-10 inset-0 w-full h-full object-cover z-0"
            />
            <div class="relative z-10 h-full flex flex-col items-center justify-center">
              <h3 class="text-3xl md:text-4xl lg:text-6xl mb-2 text-white">SIGN UP</h3>
              <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">
                Create your account
              </p>
            </div>
          </div>

          <!-- Card 2 -->
          <div
            class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden"
          >
            <img
              src="/src/assets/pan.svg"
              alt=""
              class="absolute p-10 inset-0 w-full h-full object-cover z-0"
            />
            <div class="relative z-10 h-full flex flex-col items-center justify-center">
              <h3 class="text-3xl md:text-4xl lg:text-6xl mb-2 text-white">JOIN</h3>
              <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">
                Find and join tournament
              </p>
            </div>
          </div>

          <!-- Card 3 -->
          <div
            class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden"
          >
            <img
              src="/src/assets/cards.svg"
              alt=""
              class="absolute p-10 inset-0 w-full h-full object-cover z-0"
            />
            <div class="relative z-10 h-full flex flex-col items-center justify-center">
              <h3 class="text-3xl md:text-4xl lg:text-6xl mb-2 text-white">PLAY</h3>
              <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">
                Compete with others
              </p>
            </div>
          </div>

          <!-- Card 4 -->
          <div
            class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden"
          >
            <img
              src="/src/assets/bullseye.svg"
              alt=""
              class="absolute p-10 inset-0 w-full h-full object-cover z-0"
            />
            <div class="relative z-10 h-full flex flex-col items-center justify-center">
              <h3 class="text-3xl md:text-4xl lg:text-6xl mb-2 text-white">WIN</h3>
              <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">Get your prize</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Преимущества -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-5xl mb-8 text-center text-white">Advantages</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">AUTOMATION</h3>
          <p class="text-gray-300">Automated tournament management</p>
        </div>
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">SUPPORT</h3>
          <p class="text-gray-300">24/7 technical support</p>
        </div>
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">STATISTICS</h3>
          <p class="text-gray-300">Detailed player statistics</p>
        </div>
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">STREAMING</h3>
          <p class="text-gray-300">Built-in streaming tools</p>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-4 py-12">
      <div class="mx-auto py-8 sm:px-6 sm:py-16 lg:px-2 h-full">
        <!-- Added h-full -->
        <div
          class="relative isolate overflow-hidden bg-primary px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 h-full min-h-[50vh]"
        >
          <!-- Added h-full and min-h-[80vh] -->

          <!-- Bigger SVG Background -->
          <svg
            viewBox="0 0 1024 1024"
            class="absolute top-1/2 left-1/2 -z-10 size-[80rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
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
                class="flex flex-col w-full max-w-sm p-8 space-y-8 text-center bg-white border-2 border-gray-200 rounded-lg lg:mx-4 dark:bg-secondary dark:border-myred"
              >
                <div class="flex-shrink-0">
                  <h2
                    class="inline-flex items-center justify-center px-2 font-semibold tracking-wider text-myred text-3xl uppercase rounded-lg bg-gray-50 dark:bg-primary"
                  >
                    Casual
                  </h2>
                </div>

                <div class="flex-shrink-0">
                  <span class="pt-2 text-3xl font-bold text-gray-800 uppercase dark:text-gray-100">
                    Free
                  </span>
                </div>

                <ul class="flex-1 space-y-4">
                  <li class="text-gray-500 dark:text-gray-400">Up to 5 projects</li>

                  <li class="text-gray-500 dark:text-gray-400">Up to 10 collaborators</li>

                  <li class="text-gray-500 dark:text-gray-400">2Gb of storage</li>
                </ul>

                <button
                  class="inline-flex items-center justify-center px-4 py-2 font-medium text-white uppercase bg-myred rounded-lg focus:outline-none transform hover:scale-105 transition-transform duration-200"
                >
                  Start free
                </button>
              </div>

              <div
                class="flex flex-col w-full max-w-sm p-8 space-y-8 text-center bg-white border-2 border-gray-200 rounded-lg lg:mx-4 dark:bg-secondary dark:border-myred"
              >
                <div class="flex-shrink-0">
                  <h2
                    class="inline-flex items-center justify-center px-2 font-semibold tracking-wider text-myred text-3xl uppercase rounded-lg bg-gray-50 dark:bg-primary"
                  >
                    Professional
                  </h2>
                </div>

                <div class="flex-shrink-0">
                  <span class="pt-2 text-3xl font-bold text-gray-800 uppercase dark:text-gray-100">
                    $24.90
                  </span>

                  <span class="text-gray-500 dark:text-gray-400"> /month </span>
                </div>

                <ul class="flex-1 space-y-4">
                  <li class="text-gray-500 dark:text-gray-400">Up to 10 projects</li>

                  <li class="text-gray-500 dark:text-gray-400">Up to 20 collaborators</li>

                  <li class="text-gray-500 dark:text-gray-400">10Gb of storage</li>

                  <li class="text-gray-500 dark:text-gray-400">Real-time collaborations</li>
                </ul>

                <button
                  class="inline-flex items-center justify-center px-4 py-2 font-medium text-white uppercase bg-myred rounded-lg focus:outline-none transform hover:scale-105 transition-transform duration-200"
                >
                  Start free trial
                </button>
              </div>

              <div
                class="flex flex-col w-full max-w-sm p-8 space-y-8 text-center bg-white border-2 border-gray-200 rounded-lg lg:mx-4 dark:bg-secondary dark:border-myred"
              >
                <div class="flex-shrink-0">
                  <h2
                    class="inline-flex items-center justify-center px-2 font-semibold tracking-wider text-myred text-3xl uppercase rounded-lg bg-gray-50 dark:bg-primary"
                  >
                    Expert
                  </h2>
                </div>

                <div class="flex-shrink-0">
                  <span class="pt-2 text-3xl font-bold text-gray-800 uppercase dark:text-gray-100">
                    $49.90
                  </span>

                  <span class="text-gray-500 dark:text-gray-400"> /month </span>
                </div>

                <ul class="flex-1 space-y-4">
                  <li class="text-gray-500 dark:text-gray-400">Unlimited projects</li>

                  <li class="text-gray-500 dark:text-gray-400">Unlimited collaborators</li>

                  <li class="text-gray-500 dark:text-gray-400">Unlimited storage</li>

                  <li class="text-gray-500 dark:text-gray-400">Real-time collaborations</li>

                  <li class="text-gray-500 dark:text-gray-400">24x7 Support</li>
                </ul>

                <button
                  class="inline-flex items-center justify-center px-4 py-2 font-medium text-white uppercase bg-myred rounded-lg focus:outline-none transform hover:scale-105 transition-transform duration-200"
                >
                  Start free trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style></style>
