<template>
  <div>
    <LoadingSkeleton type="posts" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPosts(page, groupName)" />

    <v-row v-if="!isLoading && !loadingError && posts.length">
      <v-col class="d-flex" v-for="article in posts" :key="article.id" cols="12" sm="6">
        <v-card
          hover
          :to="`/news/${article.slug}`"
          class="d-flex flex-column"
          :style="{ width: '100%' }"
        >
          <v-img
            :src="article.featuredImage.source"
            maxHeight="300px"
            :alt="article.featuredImage.title"
          >
            <v-chip-group column class="mt-1 ml-3" v-if="article.categories.length">
              <v-chip
                color="primary"
                text-color="white"
                v-for="category in article.categories"
                :key="category.name"
              >
                {{ category.name }}
              </v-chip>
            </v-chip-group>
          </v-img>
          <v-card-title>
            <h3 class="headline">{{ article.title }}</h3>
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
            <div v-html="article.excerpt" style="text-align: justify"></div>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-icon>mdi-chevron-right</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <NoContentYet v-if="!isLoading && !loadingError && !posts.length" />
  </div>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import NoContentYet from "@/components/partials/NoContentYet";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    NoContentYet
  },

  props: {
    page: Number,
    groupName: String,
    isMainPage: Boolean
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
    }
  },

  watch: {
    async $route() {
      this.posts = await this.getPosts(this.page, this.groupName);
    }
  },

  methods: {
    async getPosts(page, groupName, prevPosts = []) {
      // Overwrite groupName with query param if it exists
      if (this.$route.query.selection) {
        groupName = this.$route.query.selection;
      }
      let [fromCache, posts] = this.$store.getters.getFetchedPosts(page, groupName);
      if (!fromCache) {
        posts =
          (await this.$store
            .dispatch("fetchPosts", { page, groupName })
            .catch(error => console.error(error))) || [];
      }
      if (groupName) {
        this.$emit("postPagesInit", this.$store.state.totalPostPagesPerGroup[groupName]);
      } else {
        this.$emit("postPagesInit", this.$store.state.totalPostPages);
      }
      if (this.isMainPage) {
        let mainPagePosts = [...prevPosts, ...posts].filter(post => !!post.showOnMainPage);

        if (mainPagePosts.length > posts.length) {
          mainPagePosts.length = posts.length;
        } else if (mainPagePosts.length < posts.length) {
          mainPagePosts = await this.getPosts(page + 1, groupName, mainPagePosts);
        }

        return mainPagePosts;
      }
      return posts;
    }
  },

  async created() {
    this.posts = await this.getPosts(this.page, this.groupName);
  }
};
</script>

<style></style>
