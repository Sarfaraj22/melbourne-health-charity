import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { EligibilityOutcome, EligibilityQuestion } from '@/types/service'

export interface UseEligibilityCheckerReturn {
  readonly questions: ComputedRef<readonly EligibilityQuestion[]>
  readonly currentStepIndex: Ref<number>
  readonly currentQuestion: ComputedRef<EligibilityQuestion | undefined>
  readonly totalSteps: ComputedRef<number>
  readonly answers: Ref<Readonly<Record<string, string>>>
  readonly isComplete: ComputedRef<boolean>
  readonly outcome: ComputedRef<EligibilityOutcome | undefined>
  readonly canGoNext: ComputedRef<boolean>
  selectAnswer: (questionId: string, value: string) => void
  goBack: () => void
  goNext: () => void
  reset: () => void
}

const ageQuestion: EligibilityQuestion = {
  id: 'age',
  question: 'What is the age of the person needing support?',
  options: [
    { value: 'under-7', label: 'Under 7 years old' },
    { value: '7-64', label: 'Between 7 and 64 years old' },
    { value: '65-plus', label: '65 years old or over' },
  ],
}

const residencyQuestion: EligibilityQuestion = {
  id: 'residency',
  question: 'What is their residency status?',
  options: [
    {
      value: 'citizen-pr-scv',
      label: 'Australian citizen, permanent resident, or Protected Special Category Visa holder',
    },
    { value: 'other', label: 'None of these' },
  ],
}

const livesInAustraliaQuestion: EligibilityQuestion = {
  id: 'lives-in-australia',
  question: 'Do they live in Australia and spend most of their time here?',
  options: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ],
}

const disabilityQuestion: EligibilityQuestion = {
  id: 'disability',
  question:
    'Do they have a permanent, or likely permanent, disability or impairment that substantially affects their daily activities?',
  helpText: 'This may be a physical, sensory, intellectual, cognitive, or psychosocial disability.',
  options: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'unsure', label: 'Not sure' },
  ],
}

const earlyInterventionQuestion: EligibilityQuestion = {
  id: 'early-intervention',
  question:
    'Do they need some support now to reduce their future need for support, or to build the skills of family members who help them?',
  options: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ],
}

function buildQuestions(answers: Readonly<Record<string, string>>): readonly EligibilityQuestion[] {
  const questions: EligibilityQuestion[] = [
    ageQuestion,
    residencyQuestion,
    livesInAustraliaQuestion,
    disabilityQuestion,
  ]

  if (answers['disability'] !== 'yes') {
    questions.push(earlyInterventionQuestion)
  }

  return questions
}

function deriveOutcome(answers: Readonly<Record<string, string>>): EligibilityOutcome {
  const age = answers['age']
  const residency = answers['residency']
  const livesInAustralia = answers['lives-in-australia']
  const disability = answers['disability']
  const earlyIntervention = answers['early-intervention']

  if (age === 'under-7') {
    return {
      tone: 'neutral',
      heading: 'An early childhood partner may be the right first step',
      message:
        'For children younger than 7, the NDIS early childhood approach provides supports and advice without needing to apply directly. Our team can connect you with an early childhood partner in Melbourne.',
    }
  }

  if (age === '65-plus') {
    return {
      tone: 'caution',
      heading: 'You may need to explore aged care supports',
      message:
        'People must generally be under 65 when they first apply to the NDIS. If they are already an NDIS participant, they can usually stay on the scheme. Otherwise, My Aged Care may be the right pathway — our team can help you compare options.',
    }
  }

  if (residency === 'other' || livesInAustralia === 'no') {
    return {
      tone: 'caution',
      heading: 'Residency requirements may not currently be met',
      message:
        'The NDIS is only available to Australian citizens, permanent residents, or Protected Special Category Visa holders living in Australia. Based on your answers, this may not be met — contact our team to discuss other community supports that may be available.',
    }
  }

  if (disability === 'yes' || earlyIntervention === 'yes') {
    return {
      tone: 'positive',
      heading: 'They may be eligible for the NDIS',
      message:
        'Based on your answers, they may meet the NDIS access requirements. Get in touch with our team and we will help you gather evidence and start the access request.',
    }
  }

  return {
    tone: 'neutral',
    heading: 'It is unclear whether NDIS requirements are met',
    message:
      'Based on your answers, we cannot tell whether the disability or early intervention requirements are met. Our team can talk through their situation and help you understand the next steps and evidence needed.',
  }
}

export function useEligibilityChecker(): UseEligibilityCheckerReturn {
  const answers = ref<Readonly<Record<string, string>>>({})
  const currentStepIndex = ref(0)

  const questions = computed((): readonly EligibilityQuestion[] => buildQuestions(answers.value))

  const totalSteps = computed((): number => questions.value.length)

  const isComplete = computed((): boolean => currentStepIndex.value >= totalSteps.value)

  const currentQuestion = computed((): EligibilityQuestion | undefined =>
    isComplete.value ? undefined : questions.value[currentStepIndex.value],
  )

  const outcome = computed((): EligibilityOutcome | undefined =>
    isComplete.value ? deriveOutcome(answers.value) : undefined,
  )

  const canGoNext = computed((): boolean => {
    const question = currentQuestion.value
    if (question === undefined) {
      return false
    }
    return answers.value[question.id] !== undefined
  })

  function selectAnswer(questionId: string, value: string): void {
    answers.value = { ...answers.value, [questionId]: value }
  }

  function goBack(): void {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value -= 1
    }
  }

  function goNext(): void {
    if (canGoNext.value) {
      currentStepIndex.value += 1
    }
  }

  function reset(): void {
    answers.value = {}
    currentStepIndex.value = 0
  }

  return {
    questions,
    currentStepIndex,
    currentQuestion,
    totalSteps,
    answers,
    isComplete,
    outcome,
    canGoNext,
    selectAnswer,
    goBack,
    goNext,
    reset,
  }
}
