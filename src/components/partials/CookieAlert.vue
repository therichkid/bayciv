<template>
  <v-bottom-sheet v-model="hasNotAcceptedCookies" dark persistent hide-overlay>
    <v-sheet class="primary text-center">
      <div class="pa-5">
        Mit der Nutzung dieser Webseite erklären Sie sich damit einverstanden, dass wir Cookies
        verwenden.
        <v-btn text to="/datenschutz">Weiterlesen</v-btn>
      </div>
      <v-row justify="center">
        <v-checkbox
          v-model="hasUnderstood"
          color="secondary"
          label="Ich habe verstanden"
        ></v-checkbox>
      </v-row>
      <v-btn :disabled="!hasUnderstood" @click="acceptCookies()" color="success" class="mb-5"
        >Akzeptieren</v-btn
      >
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  data() {
    return {
      hasNotAcceptedCookies: true,
      hasUnderstood: false
    };
  },

  methods: {
    acceptCookies() {
      this.hasNotAcceptedCookies = false;
      localStorage.setItem("cookiesAccepted", true);
    }
  },

  mounted() {
    if (!localStorage.getItem("cookiesAccepted")) {
      localStorage.setItem("cookiesAccepted", false);
    }
    if (localStorage.getItem("cookiesAccepted") === "true") {
      this.hasNotAcceptedCookies = false;
    }
  }
};
</script>

<style></style>
