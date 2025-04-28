src/views/HomePage.vue:
<script>
export default {
  name: 'HomePage'
}
const tournaments = [
  {
    id: 1,
    name: "Summer Championship",
    organizer: "eSports League",
    sport: "Dota 2",
    startDate: "2025-06-15",
    format: "5v5",
    participants: "32/64",
    prizePool: "$50,000",
    registrationDeadline: "2025-06-10"
  },
  {
    id: 2,
    name: "Winter Cup",
    organizer: "Gaming Federation",
    sport: "CS:GO",
    startDate: "2025-12-01",
    format: "6v6",
    participants: "16/32",
    prizePool: "$25,000",
    registrationDeadline: "2025-11-25"
  },
  {
    id: 3,
    name: "Winter Cup",
    organizer: "Gaming Federation",
    sport: "CS:GO",
    startDate: "2025-12-01",
    format: "6v6",
    participants: "16/32",
    prizePool: "$25,000",
    registrationDeadline: "2025-11-25"
  }
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-secondary font-jaro">
    <!-- Навигационная панель -->
    <nav class="bg-primary shadow-md rounded-b-[2vw]">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img src="/src/assets/Logo.svg" alt="Logo" class="max-h-30vh">
        </div>
        
        <div class="hidden md:flex space-x-20 text-2xl">
          <a href="#" class="text-white hover:text-myred">Home</a>
          <a href="#" class="text-white hover:text-myred">Tournaments</a>
          <a href="#" class="text-white hover:text-myred">About Us</a>
          <a href="#" class="text-white hover:text-myred">Contacts</a>
        </div>
        
        <div class="flex items-center space-x-4">
          <a href="#" class="text-2xl bg-myred text-white px-4 py-2 rounded-[0.7vw] hover:text-myyellow">Login</a>
          <a href="#" class="text-2xl bg-myyellow text-primary px-4 py-2 rounded-[0.7vw] hover:text-myred">Sign Up</a>
        </div>
      </div>
    </nav>

    <!-- Основное содержимое -->
    <main class="flex-1">
      <!-- Герой-секция -->
      <section class="container mx-auto px-4 py-12">
    <div class="mx-auto py-8 sm:px-6 sm:py-16 lg:px-2 h-full"> <!-- Added h-full -->
      <div class="relative isolate overflow-hidden bg-primary px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 h-full min-h-[50vh]"> <!-- Added h-full and min-h-[80vh] -->
        
        <!-- Bigger SVG Background -->
        <svg viewBox="0 0 1024 1024" class="absolute top-1/2 left-1/4 -z-10 size-[80rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/4 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
          <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fill-opacity="0.7" />
          <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
              <stop stop-color="#C64242" />
              <stop offset="1" stop-color="#FFB300" />
            </radialGradient>
          </defs>
        </svg>
        
        <!-- Content Section -->
        <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-center">
          <h2 class="text-4xl font-semibold tracking-tight text-balance text-myyellow sm:text-8xl">Tour Nex</h2> <!-- Increased text size -->
          <p class="mt-6 text-3xl/8 text-pretty text-myyellow">Accept the challenge <br> Fight with the best <br> Conquer the top!</p> <!-- Increased text size -->
          <div class="mt-10 flex items-center justify-center lg:justify-center">
            <a href="#" class="rounded-[0.6vw] bg-myyellow px-4 py-3 text-5xl font-semibold text-primary shadow-xs hover:text-myred focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</a> <!-- Bigger button -->
          </div>
        </div>
        
        <!-- Bigger Image -->
        <div class="relative mt-16 h-96 lg:mt-8"> <!-- Increased h-80 to h-96 -->
          <img class="absolute top-0 left-0 w-[65rem] max-w-none rounded-3xl" src="/src/assets/bbback.jpg" alt="App screenshot" width="1824" height="1080" /> <!-- Increased w-[57rem] to w-[65rem] -->
        </div>
      </div>
    </div>
</section>
      <!-- Активные турниры -->
      <section class="container mx-auto px-4 py-12">
        <h2 class="text-4xl font-bold mb-8 text-myred">🔴 Live Tournaments</h2>
        <div class="bg-primary p-10 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="tournament in tournaments"
            :key="tournament.id"
            class="bg-secondary border-2 border-myred rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 class="text-3xl font-bold mb-2 text-white">{{ tournament.name }}</h3>
            <div class="space-y-2 text-gray-300 text-lg font-family-poppins">
              <p><span class="font-semibold">Organizer:</span> {{ tournament.organizer }}</p>
              <p><span class="font-semibold">Sport:</span> {{ tournament.sport }}</p>
              <p><span class="font-semibold">Start Date:</span> {{ tournament.startDate }}</p>
              <p><span class="font-semibold">Format:</span> {{ tournament.format }}</p>
              <p><span class="font-semibold">Participants:</span> {{ tournament.participants }}</p>
              <p><span class="font-semibold">Prize Pool:</span> {{ tournament.prizePool }}</p>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-md font-family-poppins font-semibold text-myred">
                Deadline: {{ tournament.registrationDeadline }}
              </span>
              <button class="bg-myred text-white text-2xl px-4 py-2 rounded-xl hover:bg-primary-dark">
                Attend
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Как это работает -->
      <section class="py-12 bg-secondary">
    <div class="container mx-auto px-4">
      <h2 class="text-5xl font-bold mb-8 text-center text-white">How It Works?</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <!-- Card 1 -->
        <div class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden">
          <img src="/src/assets/users.svg" alt="" class="absolute p-10 inset-0 w-full h-full object-cover z-0">
          <div class="relative z-10 h-full flex flex-col items-center justify-center">
            <h3 class="text-3xl md:text-4xl lg:text-6xl font-semibold mb-2 text-white">SIGN UP</h3>
            <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">Create your account</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden">
          <img src="/src/assets/pan.svg" alt="" class="absolute p-10 inset-0 w-full h-full object-cover z-0">
          <div class="relative z-10 h-full flex flex-col items-center justify-center">
            <h3 class="text-3xl md:text-4xl lg:text-6xl font-semibold mb-2 text-white">JOIN</h3>
            <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">Find and join tournament</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden">
          <img src="/src/assets/cards.svg" alt="" class="absolute p-10 inset-0 w-full h-full object-cover z-0">
          <div class="relative z-10 h-full flex flex-col items-center justify-center">
            <h3 class="text-3xl md:text-4xl lg:text-6xl font-semibold mb-2 text-white">PLAY</h3>
            <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">Compete with others</p>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="relative aspect-square p-6 bg-primary rounded-4xl shadow-md backdrop-blur-sm overflow-hidden">
          <img src="/src/assets/bullseye.svg" alt="" class="absolute p-10 inset-0 w-full h-full object-cover z-0">
          <div class="relative z-10 h-full flex flex-col items-center justify-center">
            <h3 class="text-3xl md:text-4xl lg:text-6xl font-semibold mb-2 text-white">WIN</h3>
            <p class="text-center text-sm md:text-md lg:text-xl text-gray-300">Get your prize</p>
          </div>
        </div>
      </div>
    </div>
  </section>

      <!-- Преимущества -->
      <section class="container mx-auto px-4 py-12">
        <h2 class="text-5xl font-bold mb-8 text-center text-white">Advantages</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-primary p-4 rounded-lg shadow-md text-center">
            <h3 class="text-white font-bold text-2xl mb-2">AUTOMATION</h3>
            <p class="text-gray-300">Automated tournament management</p>
          </div>
          <div class="bg-primary p-4 rounded-lg shadow-md text-center">
            <h3 class="text-white font-bold text-2xl mb-2">SUPPORT</h3>
            <p class="text-gray-300">24/7 technical support</p>
          </div>
          <div class="bg-primary p-4 rounded-lg shadow-md text-center">
            <h3 class="text-white font-bold text-2xl mb-2">STATISTICS</h3>
            <p class="text-gray-300">Detailed player statistics</p>
          </div>
          <div class="bg-primary p-4 rounded-lg shadow-md text-center">
            <h3 class="text-white font-bold text-2xl mb-2">STREAMING</h3>
            <p class="text-gray-300">Built-in streaming tools</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Футер -->
    <footer class="bg-primary text-white mt-auto py-8 rounded-t-[2vw]">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-bold mb-4">Tournaments</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-primary">All Tournaments</a></li>
              <li><a href="#" class="hover:text-primary">Create Tournament</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">Company</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-primary">About Us</a></li>
              <li><a href="#" class="hover:text-primary">Careers</a></li>
              <li><a href="#" class="hover:text-primary">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">Support</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-primary">Help Center</a></li>
              <li><a href="#" class="hover:text-primary">Community</a></li>
              <li><a href="#" class="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">Legal</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-primary">Terms of Service</a></li>
              <li><a href="#" class="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-primary">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2025 Tourner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jaro&display=swap');

:root {
  --font-family-jaro: "Jaro", sans-serif;
}
</style>