<template>
  <v-dialog v-model="dialog" transition="fade-transition" width="65vw">
    <v-card>
      <div class="dialog-frame">
        <TimeseriesFrame
          v-if="dialog && feature"
          :key="feature.id"
          :profile-id="feature.id"
        />
      </div>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="feedbackDialog = true">
          Submit your feedback
        </v-btn>
        <v-btn color="primary" variant="text" @click="closeDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="feedbackDialog" width="480">
      <v-card>
        <FeedbackForm :feature="props.feature" :profile-id="props.feature?.id ?? null" />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="feedbackDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import FeedbackForm from '@/components/FeedbackForm.vue'
  import TimeseriesFrame from '@/components/TimeseriesFrame.vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: null,
    },
    feature: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const feedbackDialog = ref(false)

  function closeDialog () {
    dialog.value = false
  }
</script>

<style scoped>
.dialog-frame {
  position: relative;
  width: 100%;
  height: 520px;
}
</style>
