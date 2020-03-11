<template>
  <div>
    <Loading v-if="isLoading" :height="500" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPosts(page, groupName)" />

    <v-row v-if="!isLoading && !loadingError && posts.length">
      <v-col class="d-flex" v-for="article in posts" :key="article.id" cols="12" sm="6">
        <v-card
          hover
          :ripple="false"
          :to="`/news/${article.slug}`"
          class="d-flex flex-column"
          :style="{ width: '100%' }"
        >
          <v-img
            :src="article.featuredImage.source"
            :maxHeight="dynamicImageHeight"
            :alt="article.featuredImage.title"
          >
            <v-row v-if="article.group">
              <v-col class="ml-3">
                <v-chip color="primary" class="text-truncate" text-color="white">{{
                  article.group
                }}</v-chip>
              </v-col>
            </v-row>
          </v-img>
          <v-card-title>
            <h3 class="headline" v-html="article.title"></h3>
          </v-card-title>
          <v-card-subtitle>
            <v-row align="center">
              <v-col>
                <v-icon color="primary" class="pr-1">mdi-calendar</v-icon>
                <span class="mr-2">{{ article.date }}</span>
                <v-icon color="primary" class="pr-1">mdi-account</v-icon>
                <span>{{ article.author }}</span>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-text>
            <div v-html="article.excerpt"></div>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-icon>mdi-chevron-right</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Loading from "@/components/partials/Loading";
import LoadingError from "@/components/partials/LoadingError";

export default {
  components: {
    Loading,
    LoadingError
  },

  props: {
    page: Number,
    groupName: String
  },

  data() {
    return {
      posts: []
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.postsLoading;
    },
    loadingError() {
      return this.$store.state.postsLoadingError;
    },
    dynamicImageHeight() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return "150px";
      } else {
        return "300px";
      }
    }
  },

  watch: {
    $route: function() {
      this.getPosts(this.page, this.groupName);
    }
  },

  methods: {
    async getPosts(page, groupName) {
      // Overwrite groupName with query param if it exists
      if (this.$route.query.selection) {
        groupName = this.$route.query.selection;
      }
      const postsFetched = this.$store.getters.getFetchedPosts(page, groupName);
      if (postsFetched[0]) {
        // Already fetched
        this.posts = postsFetched[1];
      } else {
        // Not fetched yet
        this.posts = await this.$store
          .dispatch("fetchPosts", { page, groupName })
          .catch(error => console.error(error));
      }
      if (groupName) {
        this.$emit("postPagesInit", this.$store.state.totalPostPagesPerGroup[groupName]);
      } else {
        this.$emit("postPagesInit", this.$store.state.totalPostPages);
      }
    }
  },

  created() {
    this.getPosts(this.page, this.groupName);
  }
};
</script>

<style></style>
