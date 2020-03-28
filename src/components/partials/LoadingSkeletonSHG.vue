<template>
  <v-row>
    <v-col cols="12">
      <v-skeleton-loader type="heading"></v-skeleton-loader>
    </v-col>
    <v-col v-for="i in 3" :key="i" cols="12" sm="4">
      <v-skeleton-loader :type="i === 1 ? 'image' : 'article'"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {};
</script>

<style></style>
