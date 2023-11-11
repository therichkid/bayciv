<template>
  <v-container>
    <h1 class="display-1 mb-2">Hörgut</h1>

    <LoadingSkeleton type="magazine" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducts(category)" />

    <v-row v-if="!isLoading && !loadingError && magazines.length" no-gutters>
      <v-col v-for="magazine in magazines" :key="magazine.id" cols="6" sm="4" lg="3" class="d-flex">
        <v-card
          flat
          hover
          tile
          color="transparent"
          :to="`/magazin/${magazine.slug}`"
          class="d-flex flex-column my-2 px-3"
          style="border-bottom: 6px solid #795548 !important; width: 100%"
        >
          <v-spacer></v-spacer>
          <v-img
            :src="magazine.featuredImage.source"
            :alt="magazine.featuredImage.title"
            maxHeight="400"
            contain
          >
            <v-chip-group class="mt-1 mr-1">
              <v-spacer></v-spacer>
              <v-chip color="primary" text-color="white" small>{{ magazine.edition }}</v-chip>
            </v-chip-group>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <NoContentYet v-if="!isLoading && !loadingError && !magazines.length" />
  </v-container>
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

  data() {
    return {
      magazines: []
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
      this.getMagazines();
    }
  },

  methods: {
    async getMagazines() {
      const magazinesFetched = this.$store.getters.getFetchedMagazines();
      if (magazinesFetched[0]) {
        // Already fetched
        this.magazines = magazinesFetched[1];
      } else {
        // Not fetched yet
        this.magazines =
          (await this.$store.dispatch("fetchMagazines").catch(error => {
            console.error(error);
          })) || [];
      }
      console.log("Formatted magazines", this.magazines);
    }
  },

  created() {
    this.getMagazines();
  }
};
</script>

<style></style>
