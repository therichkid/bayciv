<template>
  <v-container>
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getMagazineBySlug(slug)" />

    <v-row v-if="!isLoading && !loadingError">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="display-1">HörGut {{ magazine.edition }}: {{ magazine.name }}</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12" md="3">
        <v-img
          :src="magazine.featuredImage?.source"
          :alt="magazine.featuredImage?.title"
          maxHeight="400"
          contain
        >
        </v-img>
      </v-col>
      <v-col cols="12" md="9">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Kategorie</th>
                <th>Artikel</th>
                <th>Autor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="post in magazine.posts"
                :key="post.id"
                @click="navigateToPost(post.slug)"
                style="cursor: pointer"
              >
                <td>{{ post.categoriesFormatted }}</td>
                <td>{{ post.title }}</td>
                <td>{{ post.author }}</td>
                <td class="text-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-chevron-right</v-icon>
                    </template>
                    <span>Zum Beitrag gehen</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

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
      this.getMagazineBySlug(this.slug);
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
      this.magazine.posts.forEach(post => {
        post.categoriesFormatted = post.categories?.map(({ name }) => name).join(", ") || "";
      });
    },
    navigateToPost(slug) {
      this.$router.push(`/news/${slug}`);
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getMagazineBySlug(this.slug);
  }
};
</script>

<style></style>
