<template>
  <v-container>
    <h1 class="display-1 mb-2">Hörgut</h1>

    <LoadingSkeleton type="magazine" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getMagazineBySlug(slug)" />

    <v-row v-if="!isLoading && !loadingError">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="display-1">Hörgut {{ magazine.edition }}: {{ magazine.name }}</h1>
      </v-col>

      <!-- Body -->
      <!-- TODO -->
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia :link="'/magazin/' + slug" :title="magazine.name" />
      </v-col>
    </v-row>

    <v-row>
      <!-- Actions -->
      <v-col cols="12">
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import SocialMedia from "@/components/partials/SocialMedia";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    SocialMedia
  },

  props: {
    slug: String
  },

  data() {
    return {
      magazine: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.magazinesLoading;
    },
    loadingError() {
      return this.$store.state.magazinesLoadingError;
    }
  },

  watch: {
    $route() {
      this.getMagazineBySlug();
    }
  },

  methods: {
    async getMagazineBySlug(slug) {
      const [isFetched, magazine] = this.$store.getters.getFetchedMagazine(slug);
      if (isFetched) {
        this.magazine = magazine;
      } else {
        this.magazine =
          (await this.$store.dispatch("fetchMagazineBySlug", slug).catch(error => {
            console.error(error);
          })) || [];
      }
      console.log(this.magazine);
    }
  },

  created() {
    this.getMagazineBySlug();
  }
};
</script>

<style></style>
