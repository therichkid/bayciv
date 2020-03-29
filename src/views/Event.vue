<template>
  <v-container class="post-container">
    <Loading v-if="isLoading" :height="500" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getEventBySlug(slug)" />

    <EventModal
      :event="event"
      type="page"
      v-if="!isLoading && !loadingError && Object.keys(event).length"
    />
  </v-container>
</template>

<script>
import EventModal from "@/components/events/EventModal.vue";
import Loading from "@/components/partials/Loading";
import LoadingError from "@/components/partials/LoadingError";

export default {
  components: {
    EventModal,
    Loading,
    LoadingError
  },

  props: {
    slug: String,
    date: String
  },

  data() {
    return {
      event: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.eventsLoading;
    },
    loadingError() {
      return this.$store.state.eventsLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    event(event) {
      if (!event && !this.failedRequests) {
        this.$router.push("/404");
      }
    },
    $route() {
      this.getEventBySlug(this.slug);
    }
  },

  methods: {
    async getEventBySlug(slug) {
      const [year, month] = this.shared.splitDate(this.date, true);
      if ([year, month].includes(NaN)) {
        return;
      }
      const eventFetched = this.$store.getters.getFetchedEventBySlug(slug, year, month);
      if (eventFetched[0]) {
        // Already fetched
        this.event = eventFetched[1];
      } else {
        // Not fetched yet
        this.event = await this.$store.dispatch("fetchEventBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (!document.title.includes(this.event.title)) {
        document.title = this.event.title + " - " + document.title;
      }
    }
  },

  created() {
    this.getEventBySlug(this.slug);
  }
};
</script>

<style></style>
