<template>
  <v-dialog v-model="selectedOpen" scrollable max-width="600px">
    <template v-slot:activator="{ on }">
      <v-card hover v-on="on" class="d-flex flex-column event-card" style="min-width: 250px">
        <!-- Header -->
        <v-card-title class="primary white--text">
          <div v-if="event.featured">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon color="secondary" class="mr-1" v-on="on">mdi-star</v-icon>
              </template>
              <span>Hauptevent</span>
            </v-tooltip>
          </div>
          <span class="headline pr-2">{{ event.dayFormatted }}.</span>
          <span class="caption pt-2 text-truncate" style="flex: 10 0">{{ event.monthFormatted }}</span>
        </v-card-title>

        <v-card-title>
          <h3 class="headline" v-html="event.title"></h3>
        </v-card-title>

        <!-- Body -->
        <v-card-text>
          <v-chip
            v-if="event.registration"
            color="primary"
            text-color="white"
            class="mb-2"
          >Bitte anmelden!</v-chip>
          <v-row align="center" dense>
            <!-- Group -->
            <v-col cols="12" v-if="event.group">
              <v-icon color="primary" class="pr-1">mdi-account-multiple</v-icon>
              <span>{{ event.group }}</span>
            </v-col>
            <!-- Address -->
            <v-col cols="12">
              <v-icon color="primary" class="pr-1">mdi-map-marker</v-icon>
              <span class="mr-2">{{ event.address }}</span>
            </v-col>
            <!-- Time -->
            <v-col cols="12">
              <v-icon color="primary" class="pr-1">mdi-clock</v-icon>
              <span class="mr-2">
                {{ event.startTime }}
                <span v-if="event.endTime">bis {{ event.endTime }}</span>
              </span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-spacer></v-spacer>
        <!-- Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon>mdi-chevron-right</v-icon>
        </v-card-actions>
      </v-card>
    </template>

    <!-- Event popup -->
    <EventModal :event="event" type="popup" @onClose="selectedOpen = false" />
  </v-dialog>
</template>

<script>
import EventModal from "@/components/events/EventModal.vue";

export default {
  components: {
    EventModal
  },

  props: {
    event: Object
  },

  data() {
    return {
      selectedOpen: false
    };
  }
};
</script>

<style></style>
