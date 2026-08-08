import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExampleStore = defineStore('example', () => {
  const count = ref<number>(0)

  function increment(): void {
    count.value += 1
  }

  return { count, increment }
})
