<template>
  <div>
    <LoadingSkeleton type="shg" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="250" @retryAgain="getGroup(groupName)" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(group).length">
      <v-col cols="12">
        <h1 class="display-1">{{ group.name }}</h1>
      </v-col>
      <!-- 1st column -->
      <v-col cols="12" sm="4">
        <v-img :src="group.featuredImage.source" maxHeight="300px" contain alt="SHG-Logo"></v-img>
      </v-col>
      <!-- 2nd column -->
      <v-col cols="12" sm="4" v-if="group.address || group.additionalAddresses?.length">
        <v-card-title>Gruppentreffen</v-card-title>
        <v-card-text>
          <v-chip v-if="group.onlineGroup" color="primary" text-color="white" class="mb-2">
            Trifft sich online
          </v-chip>
          <div v-if="group.address" class="align-center mb-2">
            <v-icon color="primary" class="icon">mdi-map-marker</v-icon>
            <span class="body-2 text" v-html="group.address.split(', ').join('<br />')"></span>
          </div>
          <div v-if="group.additionalAddresses?.length">
            <div
              v-for="(additionalAddress, i) in group.additionalAddresses"
              :key="i"
              class="align-center mb-2"
            >
              <v-icon color="primary" class="icon">mdi-map-marker</v-icon>
              <span
                class="body-2 text"
                v-html="additionalAddress.split(', ').join('<br />')"
              ></span>
            </div>
          </div>
        </v-card-text>
      </v-col>
      <!-- 3rd column -->
      <v-col cols="12" sm="4" v-if="hasOptionalInfo">
        <v-card-title>Kontakt</v-card-title>
        <v-card-text>
          <div class="align-center mb-2" v-if="group.mailingAddress">
            <v-icon color="primary" class="icon">mdi-map-marker</v-icon>
            <span
              class="body-2 text"
              v-html="group.mailingAddress.split(', ').join('<br />')"
            ></span>
          </div>
          <div class="align-center mb-2" v-if="group.phone">
            <v-icon color="primary" class="icon">mdi-phone</v-icon>
            <span
              class="body-2 text"
              v-html="`<a href='tel:${group.phone}'>${group.phone}</a>`"
            ></span>
          </div>
          <div class="align-center mb-2" v-if="group.mobile">
            <v-icon color="primary" class="icon">mdi-cellphone</v-icon>
            <span
              class="body-2 text"
              v-html="`<a href='tel:${group.mobile}'>${group.mobile}</a>`"
            ></span>
          </div>
          <div class="align-center mb-2" v-if="group.fax">
            <v-icon color="primary" class="icon">mdi-fax</v-icon>
            <span class="body-2 text" v-html="`<a href='tel:${group.fax}'>${group.fax}</a>`"></span>
          </div>
          <div class="align-center mb-2" v-if="group.email">
            <v-icon color="primary" class="icon">mdi-email</v-icon>
            <span class="body-2 text">{{ group.email }}</span>
          </div>
          <div class="align-center" v-if="group.homepage">
            <v-icon color="primary" class="icon">mdi-web</v-icon>
            <span
              class="body-2 text"
              v-html="
                `<a href='${
                  group.homepage.includes('http') ? group.homepage : 'https://' + group.homepage
                }' target='_blank' rel='noopener noreferrer'>${group.homepage}</a>`
              "
            ></span>
          </div>
          <div class="align-center mt-5" v-if="group.instagram || group.facebook">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-if="group.instagram"
                  v-on="on"
                  :href="group.instagram"
                  target="_blank"
                  rel="nofollow"
                  class="mx-1 white--text instagram"
                  :aria-label="`${group.name} auf Instagram folgen`"
                >
                  <v-icon>mdi-instagram</v-icon>
                </v-btn>
              </template>
              <span>{{ group.name }} auf Instagram folgen</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-if="group.facebook"
                  v-on="on"
                  :href="group.facebook"
                  target="_blank"
                  rel="nofollow"
                  class="mx-1 white--text facebook"
                  :aria-label="`${group.name} auf Facebook folgen`"
                >
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
              </template>
              <span>{{ group.name }} auf Facebook folgen</span>
            </v-tooltip>
          </div>
        </v-card-text>
      </v-col>

      <!-- Content -->
      <v-col
        cols="12"
        v-html="group.content"
        :style="{ fontSize: fontSize + 'px', 'text-align': 'justify' }"
        v-if="group.content"
      ></v-col>
    </v-row>

    <v-container>
      <h1 class="display-1 mb-2">Neuigkeiten</h1>
      <Posts :page="page" :groupName="groupName" @postPagesInit="postPages = $event" />
    </v-container>
    <div class="text-center" v-if="postPages">
      <v-pagination
        v-model="page"
        :length="postPages"
        @input="changePage()"
        class="mt-2"
      ></v-pagination>
    </div>
    <Events :groupName="groupName" />

    <v-row>
      <v-col cols="12">
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import Posts from "@/components/posts/Posts";
const Events = () => import(/* webpackChunkName: "events" */ "@/components/events/Events");
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    Posts,
    Events
  },

  props: {
    groupName: String
  },

  data() {
    return {
      group: {},
      hasOptionalInfo: false,
      page: parseInt(this.$route.params.page, 10) || 1,
      postPages: 0
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.groupsLoading;
    },
    loadingError() {
      return this.$store.state.groupsLoadingError;
    },
    fontSize() {
      return this.$store.state.fontSize;
    }
  },

  watch: {
    $route() {
      this.getGroup(this.groupName);
    }
  },

  methods: {
    changePage() {
      if (this.group.isGroupLike) {
        this.$router.push(`/${this.groupName}/page/${this.page}`);
      } else {
        this.$router.push(`/shgs/${this.groupName}/page/${this.page}`);
      }
    },
    async getGroup(groupName) {
      let groups = [];
      const groupsFetched = this.$store.getters.getFetchedGroups();
      if (groupsFetched[0]) {
        // Already fetched
        groups = groupsFetched[1];
      } else {
        // Not fetched yet
        groups =
          (await this.$store.dispatch("fetchGroups").catch(error => {
            console.error(error);
          })) || [];
      }
      for (const group of groups) {
        if (group.slug === groupName) {
          this.group = group;
          this.hasOptionalInfo = this.checkOptionalInfo(group);
          break;
        }
      }
      if (this.group) {
        document.title = this.group.name + " - " + document.title;
      }
    },
    checkOptionalInfo(group) {
      return (
        !!group.mailingAddress ||
        !!group.email ||
        !!group.phone ||
        !!group.fax ||
        !!group.homepage ||
        !!group.instagram ||
        !!group.facebook
      );
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getGroup(this.groupName);
  }
};
</script>

<style scoped>
.icon {
  float: left;
}
.text {
  display: block;
  padding-left: 30px;
}
.instagram {
  background: radial-gradient(
    circle at 30% 105%,
    #fdf497 0%,
    #fdf497 5%,
    #fd5949 45%,
    #d6249f 60%,
    #285aeb 90%
  );
}
.facebook {
  background-color: #4267b2;
}
</style>
