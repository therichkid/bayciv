<template>
  <v-row dense class="align-center">
    <v-col cols="10">
      <v-text-field
        label="Link"
        v-show="showLink"
        :value="linkPrefix + routerLink"
        readonly
      ></v-text-field>
    </v-col>
    <v-col cols="2" class="text-right">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" icon v-on="on" @click="showLink = !showLink">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </template>
        <span>Link teilen!</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    routerLink: String
  },
  data() {
    return {
      showLink: false,
      linkPrefix: "https://www.bayciv.de"
    };
  }
};
</script>

<style></style>
