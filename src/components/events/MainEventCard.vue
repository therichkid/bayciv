<template>
  <v-dialog v-model="selectedOpen" scrollable max-width="600px">
    <template v-slot:activator="{ on }">
      <v-card hover v-on="on" class="d-flex flex-column event-card" style="min-width: 250px">
        <v-img maxHeight="250px" :src="event.featuredImage.source"></v-img>
        <v-card-title>
          <h3 class="headline" v-html="event.title"></h3>
        </v-card-title>
        <v-card-subtitle>
          <v-row align="center">
            <v-col>
              <v-icon color="primary" class="pr-1">mdi-calendar</v-icon>
              <span class="mr-2">{{ event.dateFormatted }}</span>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-spacer></v-spacer>
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
