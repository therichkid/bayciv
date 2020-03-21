<template>
  <v-container>
    <h1 class="display-1">404: Seite nicht gefunden!</h1>
    <v-img src="@/assets/ghost.svg" contain height="250px" class="my-5"></v-img>
    <p>Diese Seite gibt es nicht mehr oder hat es nie gegeben.</p>
    <p>
      <span>Benutzen Sie die Suche&nbsp;</span>
      <v-icon>mdi-magnify</v-icon>
      <span>
        &nbsp;oben rechts oder finden Sie weitere interessante Neuigkeiten rund um das
        Cochlea-Implantat auf der Startseite.
      </span>
    </p>
    <v-btn to="/">
      <v-icon>mdi-chevron-left</v-icon>
      <span>Home</span>
    </v-btn>
  </v-container>
</template>

<script>
export default {};
</script>

<style></style>
