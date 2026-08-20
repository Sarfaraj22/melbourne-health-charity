<script setup lang="ts">
interface Props {
  readonly fieldId: string
  readonly files: readonly File[]
  readonly errorMessage: string
  readonly accept: string
  readonly hint: string
}

defineProps<Props>()

const emit = defineEmits<{
  add: [list: FileList | null]
  remove: [index: number]
}>()

function onFileChange(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    emit('add', target.files)
    target.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="fieldId" class="text-sm font-medium text-text-default">
      Attachments <span class="font-normal text-text-subtle">(optional)</span>
    </label>
    <input
      :id="fieldId"
      type="file"
      multiple
      :accept="accept"
      class="text-sm text-text-default file:mr-3 file:rounded file:border file:border-brand-primary file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-brand-primary"
      @change="onFileChange"
    />
    <p class="text-xs text-text-subtle">{{ hint }}</p>
    <ul v-if="files.length > 0" class="flex flex-col gap-1">
      <li
        v-for="(file, index) in files"
        :key="`${file.name}-${String(index)}`"
        class="flex items-center justify-between gap-2 text-sm text-text-default"
      >
        <span>{{ file.name }}</span>
        <button
          type="button"
          class="font-bold text-brand-primary underline hover:text-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          @click="emit('remove', index)"
        >
          Remove
        </button>
      </li>
    </ul>
    <p v-if="errorMessage.length > 0" class="text-sm text-brand-donate" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>
