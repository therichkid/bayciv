<template>
  <div>
    <v-container>
      <v-card class="mb-4">
        <v-banner :single-line="$vuetify.breakpoint.mdAndUp" color="primary" class="white--text">
          <span class="subtitle-1">
            Wir beraten, informieren und vertreten Ihre Interessen. Gemeinsam sind wir stark!
          </span>
          <template v-slot:actions>
            <v-btn text dark :to="'/verband'">Mehr Infos</v-btn>
          </template>
        </v-banner>
      </v-card>

      <h1 class="display-1 mb-2">Neuigkeiten</h1>
      <Posts :page="1" />
    </v-container>
    <div class="text-center">
      <v-btn :disabled="postPages < 2" large color="primary" @click="loadMorePosts()" class="mb-2"
        >Mehr Neuigkeiten</v-btn
      >
    </div>
    <Events />
    <Events type="mainEvents" />
  </div>
</template>

<script>
import Posts from "@/components/posts/Posts";
import Events from "@/components/events/Events";

export default {
  components: {
    Posts,
    Events
  },

  computed: {
    postPages() {
      return this.$store.state.totalPostPages;
    }
  },

  methods: {
    loadMorePosts() {
      this.$router.push("/news/page/2");
    }
  }
};
</script>

<style></style>
