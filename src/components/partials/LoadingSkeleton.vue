<template>
  <!-- Posts -->
  <v-row v-if="type === 'posts'">
    <v-col v-for="i in amount" :key="i" cols="12" sm="6">
      <v-skeleton-loader type="image, article, actions"></v-skeleton-loader>
    </v-col>
  </v-row>

  <!-- SHG -->
  <v-row v-else-if="type === 'shg'">
    <v-col cols="12">
      <v-skeleton-loader type="heading"></v-skeleton-loader>
    </v-col>
    <v-col v-for="i in 3" :key="i" cols="12" sm="4">
      <v-skeleton-loader :type="i === 1 ? 'image' : 'article'"></v-skeleton-loader>
    </v-col>
  </v-row>

  <!-- Post, page -->
  <v-row v-else>
    <v-col cols="12">
      <v-skeleton-loader type="article, image, list-item-three-line, actions"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    type: String
  },

  computed: {
    amount() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 2;
      } else {
        return 4;
      }
    }
  }
};
</script>

<style></style>
