<template>
  <div>
    <v-menu v-if="!isHidden" v-model="isOpen" offset-y max-height="75%">
      <template v-slot:activator="scope">
        <v-text-field
          @click="scope.value = true"
          @keydown="scope.value = true"
          v-model="model"
          :loading="isLoading"
          placeholder="Nach Artikeln & Events suchen"
          solo
          flat
          hide-details
          autofocus
          :light="!$vuetify.theme.dark"
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="toggleSearchBar"
          style="width: 55vw; max-width: 600px;"
        >
        </v-text-field>
      </template>
      <v-list>
        <v-subheader>
          Artikel
          <v-spacer></v-spacer>
          <v-switch dense v-model="includePosts"></v-switch>
        </v-subheader>
        <v-list-item v-for="post in items.posts" :key="post.id" :to="`/news/${post.slug}`">
          <v-list-item-title v-html="post.title.rendered" class="text-truncate"></v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader>
          Events
          <v-spacer></v-spacer>
          <v-switch dense v-model="includeEvents"></v-switch>
        </v-subheader>
        <v-list-item
          v-for="event in items.events"
          :key="event.id"
          :to="`/events/${event.acf.event_datum}/${event.slug}`"
        >
          <v-list-item-title
            v-html="event.title.rendered"
            class="text-truncate"
          ></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      icon
      text
      :style="{
        float: 'right',
        'background-color': getButtonBackgroundColor()
      }"
      v-if="isHidden"
      @click.stop="toggleSearchBar()"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: { posts: [], events: [] },
      isLoading: false,
      isHidden: true,
      isOpen: false,
      model: null,
      includePosts: true,
      includeEvents: true,
      timeout: null
    };
  },

  computed: {
    isMobile() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return true;
      } else {
        return false;
      }
    }
  },

  watch: {
    model(value) {
      // Call with simple debounce
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.search(value);
      }, 150);
    },
    includePosts(value) {
      if (value) {
        this.search(this.model);
      } else {
        this.items.posts = [];
      }
    },
    includeEvents(value) {
      if (value) {
        this.search(this.model);
      } else {
        this.items.events = [];
      }
    }
  },

  methods: {
    toggleSearchBar() {
      this.isHidden = !this.isHidden;
      if (this.isHidden) {
        this.model = null;
      }
    },
    async search(value) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      const perPage = this.includePosts && this.includeEvents ? 5 : 10;
      const fetchPosts = this.includePosts
        ? this.$store.dispatch("fetchPostsBySearchTerm", { search: value, perPage })
        : [];
      const fetchEvents = this.includeEvents
        ? this.$store.dispatch("fetchEventsBySearchTerm", { search: value, perPage })
        : [];
      const [posts, events] = await Promise.all([fetchPosts, fetchEvents])
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false;
        });
      // Re-open menu on mobile...
      // ...if there are search results now but none before
      const cond1 =
        (posts.length || events.length) && !this.items.posts.length && !this.items.events.length;
      // ...or if there were search results before but none now
      const cond2 =
        (this.items.posts.length || this.items.events.length) && !posts.length && !events.length;
      if (this.isMobile && (cond1 || cond2)) {
        this.isOpen = false;
        setTimeout(() => {
          this.isOpen = true;
        });
      }
      this.items.posts = posts;
      this.items.events = events;
    },
    getButtonBackgroundColor() {
      if (!this.isMobile) {
        return null;
      }
      return this.$vuetify.theme.dark ? "var(--v-primary-base)" : "var(--v-secondary-base)";
    }
  }
};
</script>

<style></style>
