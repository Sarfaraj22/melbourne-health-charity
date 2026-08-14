<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useEligibilityChecker } from '@/composables/useEligibilityChecker'
import type { EligibilityOutcomeTone } from '@/types/service'
import { assertNever } from '@/utils/assertNever'

import shieldCheckIcon from '@/assets/icons/shield-check.svg?raw'
import checkCircleIcon from '@/assets/icons/check-circle.svg?raw'
import circleAlertIcon from '@/assets/icons/circle-alert.svg?raw'

const {
  currentQuestion,
  currentStepIndex,
  totalSteps,
  answers,
  isComplete,
  outcome,
  canGoNext,
  selectAnswer,
  goBack,
  goNext,
  reset,
} = useEligibilityChecker()

const stepLabel = computed(
  (): string => `Question ${currentStepIndex.value + 1} of ${totalSteps.value}`,
)

function outcomeIcon(tone: EligibilityOutcomeTone): string {
  switch (tone) {
    case 'positive':
      return checkCircleIcon
    case 'caution':
    case 'neutral':
      return circleAlertIcon
    default:
      return assertNever(tone)
  }
}

function outcomeClasses(tone: EligibilityOutcomeTone): string {
  switch (tone) {
    case 'positive':
      return 'border-status-success bg-status-success-bg text-status-success'
    case 'caution':
      return 'border-status-caution bg-status-caution-bg text-status-caution'
    case 'neutral':
      return 'border-border-default bg-surface-muted text-text-muted'
    default:
      return assertNever(tone)
  }
}
</script>

<template>
  <aside
    aria-labelledby="eligibility-heading"
    class="rounded border border-border-default bg-surface p-6"
  >
    <h2 id="eligibility-heading" class="text-lg font-bold text-text-default">
      Check Your Eligibility
    </h2>

    <div v-if="isComplete && outcome" class="mt-4 flex flex-col gap-4">
      <div :class="['flex flex-col gap-3 rounded border p-4', outcomeClasses(outcome.tone)]">
        <!-- eslint-disable-next-line vue/no-v-html -- icon is a trusted local SVG asset, not user input -->
        <span aria-hidden="true" class="size-6 [&>svg]:size-6" v-html="outcomeIcon(outcome.tone)" />
        <p class="text-base font-bold" role="status">{{ outcome.heading }}</p>
        <p class="text-sm text-text-muted">{{ outcome.message }}</p>
      </div>

      <AppButton to="/contact" variant="primary" class="w-full">Talk to our team</AppButton>
      <button
        type="button"
        class="text-sm font-medium text-brand-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        @click="reset"
      >
        Start again
      </button>
    </div>

    <form v-else-if="currentQuestion" class="mt-4 flex flex-col gap-4" @submit.prevent="goNext">
      <p class="text-xs font-medium uppercase tracking-wide text-text-subtle">{{ stepLabel }}</p>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-sm font-medium text-text-default">
          {{ currentQuestion.question }}
        </legend>
        <p v-if="currentQuestion.helpText" class="text-xs text-text-subtle">
          {{ currentQuestion.helpText }}
        </p>

        <div
          class="mt-1 flex flex-col gap-2"
          role="radiogroup"
          :aria-label="currentQuestion.question"
        >
          <button
            v-for="option in currentQuestion.options"
            :key="option.value"
            type="button"
            role="radio"
            :aria-checked="answers[currentQuestion.id] === option.value"
            :class="[
              'rounded border px-4 py-2.5 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
              answers[currentQuestion.id] === option.value
                ? 'border-brand-primary bg-brand-primary text-text-on-brand'
                : 'border-border-default bg-surface text-text-default',
            ]"
            @click="selectAnswer(currentQuestion.id, option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </fieldset>

      <div class="flex gap-3">
        <AppButton
          v-if="currentStepIndex > 0"
          type="button"
          variant="secondary"
          class="flex-1"
          @click="goBack"
        >
          Back
        </AppButton>
        <AppButton type="submit" variant="primary" class="flex-1" :disabled="!canGoNext">
          Next
        </AppButton>
      </div>
    </form>

    <div class="mt-4 flex items-center justify-center gap-1.5">
      <!-- eslint-disable vue/no-v-html -- icon is a trusted local SVG asset, not user input -->
      <span
        aria-hidden="true"
        class="size-3 text-text-subtle [&>svg]:size-3"
        v-html="shieldCheckIcon"
      />
      <!-- eslint-enable vue/no-v-html -->
      <p class="text-xs text-text-subtle">
        This tool gives general guidance only and is not an official NDIS decision
      </p>
    </div>
  </aside>
</template>
