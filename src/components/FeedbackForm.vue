<template>
  <div class="pa-3">
    <div class="text-h6 mb-1">
      Submit feedback
    </div>
    <p class="text-caption text-medium-emphasis mb-3">
      Your feedback is stored by Shoreline Monitor services. Client IP may be logged server-side for abuse prevention and quality control.
    </p>

    <v-form @submit.prevent="onSubmit">
      <p class="text-body-2 font-weight-medium mb-1">
        In your judgement, how reliable are the data points as an indicator of shoreline change at this location?
      </p>

      <v-radio-group v-model="reliability" class="mb-3" density="compact" hide-details>
        <v-radio
          v-for="option in reliabilityOptions"
          :key="option"
          :label="option"
          :value="option"
        />
      </v-radio-group>

      <template v-if="showQuestionableOptions">
        <p class="text-body-2 font-weight-medium mb-1">
          Could you select a possible technical or contextual cause(s) from the list below?
        </p>

        <v-checkbox
          v-for="option in questionableDetailOptions"
          :key="option"
          v-model="details"
          class="mb-1"
          density="compact"
          hide-details
          :label="option"
          :value="option"
        />

        <v-text-field
          v-if="showOtherInput"
          v-model="otherText"
          class="mt-2 mb-1"
          density="compact"
          hide-details
          label="Please specify"
          maxlength="500"
          variant="outlined"
        />
      </template>

      <v-alert
        v-if="validationError"
        class="mb-3"
        density="compact"
        type="error"
        variant="tonal"
      >
        {{ validationError }}
      </v-alert>

      <v-alert
        v-if="submitError"
        class="mb-3"
        density="compact"
        type="error"
        variant="tonal"
      >
        {{ submitError }}
      </v-alert>

      <v-alert
        v-if="submitSuccess"
        class="mb-3"
        density="compact"
        type="success"
        variant="tonal"
      >
        Thank you for your feedback.
      </v-alert>

      <v-btn
        block
        color="primary"
        :disabled="submitting"
        :loading="submitting"
        type="submit"
      >
        Submit feedback
      </v-btn>
    </v-form>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import submitFeedback from '@/lib/submit-feedback'

  const reliabilityOptions = [
    'Reliable / representative',
    'Questionable (interpret with caution)',
    'Not reliable',
  ]

  const questionableDetailOptions = [
    'Some data points are not regarded as outliers',
    'Time series signal is not complete',
    'Coast is morphologically complex',
    'Human intervention likely',
    'Other:',
  ]

  const props = defineProps({
    profileId: {
      type: [Number, String],
      default: null,
    },
    feature: {
      type: Object,
      default: () => null,
    },
  })

  const reliability = ref('')
  const details = ref([])
  const otherText = ref('')
  const validationError = ref('')
  const submitError = ref('')
  const submitSuccess = ref(false)
  const submitting = ref(false)

  const featureProperties = computed(() => props.feature?.properties ?? {})
  const showQuestionableOptions = computed(() => reliability.value.includes('Questionable'))
  const showOtherInput = computed(() => details.value.includes('Other:'))

  watch(reliability, value => {
    validationError.value = ''
    submitError.value = ''
    submitSuccess.value = false

    if (!value.includes('Questionable')) {
      details.value = []
      otherText.value = ''
    }
  })

  watch(details, value => {
    validationError.value = ''
    submitError.value = ''
    submitSuccess.value = false

    if (!value.includes('Other:')) {
      otherText.value = ''
    }
  })

  watch(otherText, () => {
    validationError.value = ''
    submitError.value = ''
    submitSuccess.value = false
  })

  function toNumberOrNull (value) {
    if (value === null || value === undefined || value === '') {
      return null
    }

    const number = Number(value)
    return Number.isFinite(number) ? number : null
  }

  function pickFirst (obj, keys) {
    for (const key of keys) {
      const value = obj?.[key]
      if (value !== undefined && value !== null && value !== '') {
        return value
      }
    }
    return null
  }

  function validateForm () {
    if (!reliability.value) {
      return 'Please select an assessment option.'
    }

    if (showQuestionableOptions.value && details.value.length === 0) {
      return 'Please select at least one reason.'
    }

    if (showOtherInput.value && !otherText.value.trim()) {
      return 'Please specify the \'Other\' reason.'
    }

    return ''
  }

  function buildPayload () {
    return {
      reliability: reliability.value,
      details: showQuestionableOptions.value ? details.value : [],
      other_text: showOtherInput.value ? otherText.value.trim() : null,
      transect_id: pickFirst(featureProperties.value, ['transect_id', 'transectId']),
      profileid: toNumberOrNull(props.profileId),
    }
  }

  function getSubmissionError (error) {
    const responseData = error?.response?.data

    if (responseData?.description) {
      return responseData.description
    }
    if (responseData?.message) {
      return responseData.message
    }
    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData
    }

    return 'Could not submit feedback. Please try again.'
  }

  async function onSubmit () {
    validationError.value = validateForm()
    submitError.value = ''
    submitSuccess.value = false

    if (validationError.value) {
      return
    }

    submitting.value = true
    try {
      await submitFeedback(buildPayload())
      submitSuccess.value = true
    } catch (error) {
      submitError.value = getSubmissionError(error)
    } finally {
      submitting.value = false
    }
  }
</script>
