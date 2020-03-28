<template>
  <v-row>
    <v-col v-for="i in amount" :key="i" cols="12" sm="6">
      <v-skeleton-loader type="image, article, actions"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
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
