<template>
  <div>
    <v-form v-model="valid">
      <v-text-field
        label="E-Mail"
        v-model="email"
        :rules="emailRules"
        required
        :solo-inverted="type === 'subscribe'"
      ></v-text-field>
      <v-text-field label="HP" v-model="hp" v-show="false"></v-text-field>
      <v-btn
        :class="{ secondary: type === 'subscribe' }"
        :disabled="!valid || !email"
        :loading="isPosting"
        @click="postForm"
      >
        {{ type === "subscribe" ? "Abonnieren" : "Abmelden" }}
      </v-btn>
    </v-form>

    <AlertModal
      :dialog="dialog"
      :alertType="alertType"
      :alertMessage="alertMessage"
      page="newsletter"
      @dialog="dialog = false"
    />
  </div>
</template>

<script>
import api from "@/services/api";
const AlertModal = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/AlertModal");

export default {
  components: {
    AlertModal
  },

  props: {
    type: String
  },

  data() {
    return {
      valid: false,
      email: "",
      emailRules: [v => /\S+@\S+\.\S+/.test(v) || !v || "Diese E-Mail ist ungültig!"],
      hp: "",
      isPosting: false,
      initTime: 0,
      dialog: false,
      alertMessage: "",
      alertType: ""
    };
  },

  methods: {
    async postForm() {
      this.isPosting = true;
      const data = {
        recipient: {
          email: this.email.trim()
        },
        _timer: Date.now() - this.initTime
      };
      // Honeypot
      if (this.hp && this.hp.length) {
        data._hp = this.hp;
      }
      await api
        .postData("newsletter", data, this.type)
        .then(response => {
          this.alertType = "success";
          this.alertMessage = response;
          this.email = "";
        })
        .catch(error => {
          this.alertType = "error";
          this.alertMessage = error;
        })
        .finally(() => {
          this.isPosting = false;
          this.dialog = true;
        });
    }
  },

  mounted() {
    this.initTime = Date.now();
  }
};
</script>

<style></style>
