<template>
  <v-container>
    <v-row align="center">
      <v-col cols="auto" class="mr-auto">
        <h2 class="display-1 my-2" style="word-break: break-all">
          <template v-if="type === 'mainEvents'">
            <span id="hauptveranstaltungen">Hauptveranstaltungen</span>
            <v-chip color="primary" text-color="white" class="ml-2 mb-1">Bitte anmelden!</v-chip>
          </template>
          <span v-else id="veranstaltungen">Veranstaltungen</span>
        </h2>
      </v-col>
      <v-col cols="auto" v-if="type !== 'mainEvents' && !groupName">
        <v-btn text to="/events">
          <span>Mehr</span>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <Loading v-if="isLoading" :height="250" />
    <LoadingError v-if="loadingError" :height="250" @retryAgain="initiateEvents()" />

    <template v-if="!isLoading && !loadingError && events.length">
      <!-- Desktop devices -->
      <v-card flat tile class="transparent" v-if="$vuetify.breakpoint.mdAndUp">
        <v-window v-model="window">
          <v-window-item v-for="i in pages" :key="i">
            <v-container>
              <v-row>
                <v-col cols="4" lg="3" v-for="event in eventsInView" :key="event.id" class="d-flex">
                  <MainEventCard :event="event" v-if="type === 'mainEvents'" />
                  <EventCard :event="event" v-else />
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
        <!-- Action bar -->
        <v-card-actions class="justify-space-between">
          <v-btn icon large @click="prev()" aria-label="Vorherige Veranstaltungen">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-item-group mandatory v-model="window" class="text-center" style="width: auto">
            <v-item v-for="i in pages" :key="i" v-slot:default="{ active, toggle }">
              <v-btn :input-value="active" icon @click="toggle" aria-hidden="true">
                <v-icon>mdi-record</v-icon>
              </v-btn>
            </v-item>
          </v-item-group>
          <v-btn icon large @click="next()" aria-label="Nächste Veranstaltungen">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Mobile devices -->
      <v-row no-gutters v-if="$vuetify.breakpoint.smAndDown" class="horizontal-scrolling-wrapper">
        <v-col v-for="event in events" :key="event.id" class="d-flex pa-2">
          <MainEventCard :event="event" v-if="type === 'mainEvents'" />
          <EventCard :event="event" v-else />
        </v-col>
      </v-row>
    </template>

    <NoContentYet v-if="!isLoading && !loadingError && !events.length" />
  </v-container>
</template>

<script>
import EventCard from "@/components/events/EventCard";
import MainEventCard from "@/components/events/MainEventCard";
import Loading from "@/components/partials/Loading";
import NoContentYet from "@/components/partials/NoContentYet";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    Loading,
    LoadingError,
    EventCard,
    MainEventCard,
    NoContentYet
  },

  props: {
    type: String,
    groupName: String
  },

  data() {
    return {
      events: [],
      window: 0,
      pages: 0,
      eventsPerPage: 0,
      eventsInView: []
    };
  },

  computed: {
    isLoading() {
      return this.type === "mainEvents"
        ? this.$store.state.mainEventsLoading
        : this.$store.state.eventsLoading;
    },
    loadingError() {
      return this.type === "mainEvents"
        ? this.$store.state.mainEventsLoadingError
        : this.$store.state.eventsLoadingError;
    },
    fontSize() {
      return this.$store.state.fontSize;
    }
  },

  watch: {
    window() {
      this.changeEventsInView();
    }
  },

  methods: {
    async getEvents(year, month, iteration = 1) {
      let events = [];
      if (!year || !month) {
        const today = this.shared.getCurrentDate();
        [year, month] = this.shared.splitDate(today, false);
      }
      const eventsFetched = this.$store.getters.getFetchedEvents(year, month);
      if (eventsFetched[0]) {
        // Already fetched
        events = eventsFetched[1];
      } else {
        // Not fetched yet
        events =
          (await this.$store
            .dispatch("fetchEvents", {
              startDate: this.shared.getStartOfMonthDate(year, month),
              endDate: this.shared.getEndOfMonthDate(year, month),
              storeEvents: true
            })
            .catch(error => console.error(error))) || [];
      }
      const newMonth = month === 12 ? 1 : month + 1;
      const newYear = month === 12 ? year + 1 : year;
      if (iteration < 2) {
        const newEvents = await this.getEvents(newYear, newMonth, iteration + 1);
        events.push(...newEvents);
      }
      return events;
    },
    async getMainEvents() {
      let events = [];
      const today = this.shared.getCurrentDate();
      const [year, month] = this.shared.splitDate(today, false);
      const eventsFetched = this.$store.getters.getFetchedMainEvents();
      if (eventsFetched[0]) {
        // Already fetched
        events = eventsFetched[1];
      } else {
        // Not fetched yet
        events =
          (await this.$store
            .dispatch("fetchEvents", {
              startDate: `${year}${month < 10 ? "0" : ""}${month}01`,
              onlyMainEvents: true,
              storeEvents: true
            })
            .catch(error => console.error(error))) || [];
      }
      return events;
    },
    async getEventsPerGroup(groupName) {
      let events = [];
      const today = this.shared.getCurrentDate();
      const [year, month] = this.shared.splitDate(today, false);
      const eventsFetched = this.$store.getters.getFetchedEventsPerGroup(groupName);
      if (eventsFetched[0]) {
        // Already fetched
        events = eventsFetched[1];
      } else {
        // Not fetched yet
        events =
          (await this.$store
            .dispatch("fetchEvents", {
              startDate: `${year}${month < 10 ? "0" : ""}${month}01`,
              groupName,
              storeEvents: true
            })
            .catch(error => console.error(error))) || [];
      }
      return events;
    },
    async initiateEvents() {
      let events;
      if (this.type === "mainEvents") {
        events = await this.getMainEvents();
      } else if (this.groupName) {
        events = await this.getEventsPerGroup(this.groupName);
      } else {
        events = await this.getEvents();
      }
      this.events = [];
      const today = this.shared.getCurrentDate("-");
      for (const event of events) {
        if (event.startDate >= today || event.endDate >= today) {
          this.events.push(event);
        }
      }
      // Cut the shown events down to max 12
      this.events = this.events.slice(0, 12);
    },
    changeEventsPerPage() {
      // Check the page width and decide how many events per page should be shown
      let eventsPerPage;
      if (this.$vuetify.breakpoint.mdAndDown) {
        eventsPerPage = 3;
      } else {
        eventsPerPage = 4;
      }
      if (eventsPerPage !== this.eventsPerPage) {
        // Calculate the number of pages
        this.pages = Math.ceil(this.events.length / eventsPerPage);
        this.eventsPerPage = eventsPerPage;
        this.changeEventsInView();
      }
    },
    changeEventsInView() {
      // Change the events that are currently shown
      this.eventsInView = this.events.slice(
        this.window * this.eventsPerPage,
        this.window * this.eventsPerPage + this.eventsPerPage
      );
    },
    next() {
      this.window = this.window + 1 === this.pages ? 0 : this.window + 1;
    },
    prev() {
      this.window = this.window - 1 < 0 ? this.pages - 1 : this.window - 1;
    }
  },

  async created() {
    await this.initiateEvents();
    this.changeEventsPerPage();
    window.addEventListener("resize", this.changeEventsPerPage);
  },

  destroyed() {
    window.removeEventListener("resize", this.changeEventsPerPage);
  }
};
</script>

<style scoped>
.horizontal-scrolling-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}
</style>
