<template>
  <v-dialog
    scrollable
    persistent
    v-model="showDialog"
    :max-width="640"
  >
    <v-card class="d-flex flex-column" style="max-height: 100%;overflow:hidden">
      <v-card-title class="pa-5">
        <v-toolbar-title>Shoreline Monitor App User Agreement</v-toolbar-title>
      </v-card-title>

      <div class="px-5 flex-grow-1 overflow-y-auto">
        Shoreline Monitor App has been set up with the greatest possible care. However, the app is for informational purposes only. No rights can be derived from the information in the app and the use of the app and the information offered is at your own expense and risk. Neither the Shoreline Monitor platform, nor other parties affiliated to the Shoreline Monitor, accept any form of liability - for whatever reason - for any form of damage (including property damage, financial loss as a result of material damage and pure financial loss) arising in any way from the operation of and/or use of (information on) the app.
Neither the Shoreline Monitor platform nor other parties involved in the Shoreline Monitor can guarantee that the app is bug-free or will function without errors and/or interruptions. The app can be changed by Shoreline Monitor at any time. Dutch law applies to the app as well as to these terms and conditions.
<br />
<br />

This app does not use any cookies.
Click the 'I agree' button to confirm to the conditions of use as stated above.
        </div>


      <v-card-actions>
          <form action="" submit.prevent style="width:100%" >
            <div class="d-flex pa-2" >
              <v-btn 
                color="primary"
                @click="appStore.acceptLegal"
                class="ml-auto"
              >
                I agree
              </v-btn>
           </div>
          </form>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const showDialog = computed(() => !appStore.acceptedLegal)
</script>