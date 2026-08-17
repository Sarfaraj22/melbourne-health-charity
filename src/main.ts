import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { initAuth, useAuthStore } from './stores/auth.store'
import './assets/styles/main.css'

import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialise the Firebase auth listener before mounting so the router guard
// never observes a stale unauthenticated state on a reload of a protected page.
const authStore = useAuthStore()
initAuth()

void authStore.ready.then(() => {
  app.mount('#app')
})
