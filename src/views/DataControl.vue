<template>
  <v-container class="post-container">
    <v-row align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="display-1">Datenkontrolle</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12">
        <h3>Cookies zurücksetzen</h3>
        <div class="mb-2">
          Klicken Sie auf den folgenden Knopf, um alle Cookies auf dieser Seite zurückzusetzen. Im
          Anschluss können Sie Ihre Wahl zu den Cookies erneut treffen.
        </div>
        <v-btn @click="resetCookies()">Cookies zurücksetzen</v-btn>
        <h3 class="mt-5">Abmeldung vom Newsletter</h3>
        <div class="mb-2">
          Wenn Sie sich vom Newsletter abmelden möchten, geben Sie Ihre E-Mail-Adresse in das
          folgende Feld ein und klicken Sie auf den "Abmelden"-Knopf.
        </div>
        <Newsletter method="unsubscribe" />
      </v-col>

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
const Newsletter = () => import(/* webpackChunkName: "form" */ "@/components/partials/Newsletter");

export default {
  components: {
    Newsletter
  },

  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    resetCookies() {
      document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      localStorage.clear();
      window.location.href = "/";
    }
  }
};
</script>

<style></style>
