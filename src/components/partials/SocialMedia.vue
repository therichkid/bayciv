<template>
  <div class="text-right">
    <span v-for="child in socialMedia" :key="child.component">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <component
              :is="child.component"
              :url="url"
              scale="2"
              v-bind="{ [child.titleProp]: title }"
              v-on="on"
            ></component>
          </v-btn>
        </template>
        <span>Über {{ child.name || child.component }} teilen!</span>
      </v-tooltip>
    </span>
  </div>
</template>

<script>
import { Email, Facebook, Twitter, WhatsApp } from "vue-socialmedia-share";

export default {
  components: {
    Email,
    Facebook,
    Twitter,
    WhatsApp
  },

  props: {
    link: String,
    title: String
  },

  data() {
    return {
      showLink: false,
      socialMedia: [
        {
          component: "Email",
          titleProp: "subject",
          name: "E-Mail"
        },
        {
          component: "Facebook"
        },
        {
          component: "Twitter",
          titleProp: "title"
        },
        {
          component: "WhatsApp",
          titleProp: "title"
        }
      ],
      linkPrefix: "https://www.bayciv.de"
    };
  },

  computed: {
    url() {
      return this.linkPrefix + this.link;
    }
  }
};
</script>

<style scoped>
/* .social-media > span {
  padding: 5px;
  vertical-align: middle;
  display: inline-block;
} */
</style>
