<template>
  <v-dialog v-model="isSelectedOpen" scrollable max-width="600px">
    <template v-slot:activator="{ on }">
      <v-card hover v-on="on" class="d-flex flex-column event-card">
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
          <span class="caption pt-2 text-truncate" style="flex: 10 0">
            {{ event.monthFormatted }}
          </span>
        </v-card-title>

        <v-card-title>
          <h3 :class="$vuetify.breakpoint.mdAndUp ? 'headline' : 'title'">{{ event.title }}</h3>
        </v-card-title>

        <!-- Body -->
        <v-card-text>
          <v-chip v-if="event.registration" color="primary" text-color="white" class="mb-2">
            Bitte anmelden!
          </v-chip>
          <v-row align="center" dense>
            <!-- Groups -->
            <v-col cols="12" v-if="event.groups.length">
              <v-icon color="primary" class="pr-1">mdi-account-multiple</v-icon>
              <span v-for="(group, i) in event.groups" :key="i">
                <span v-if="i !== 0">, </span>
                <span>{{ group.name }}</span>
              </span>
            </v-col>
            <!-- Address -->
            <v-col cols="12" v-if="event.address">
              <v-icon color="primary" class="pr-1">mdi-map-marker</v-icon>
              <span>{{ event.address }}</span>
            </v-col>
            <!-- Time -->
            <v-col cols="12">
              <v-icon color="primary" class="pr-1">mdi-clock</v-icon>
              <span>{{ event.startTime }}</span>
              <span v-if="event.endTime"> bis {{ event.endTime }}</span>
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
    <EventModal :event="event" type="popup" @onClose="isSelectedOpen = false" />
  </v-dialog>
</template>

<script>
const EventModal = () => import(/* webpackChunkName: "dialog" */ "@/components/events/EventModal");

export default {
  components: {
    EventModal
  },

  props: {
    event: Object
  },

  data() {
    return {
      isSelectedOpen: false
    };
  }
};
</script>

<style></style>
