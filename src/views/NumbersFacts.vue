<template>
  <v-container>
    <h1 class="display-1 mb-2">Zahlen und Fakten</h1>

    <Posts :page="page" groupName="zahlen-fakten" @postPagesInit="postPages = $event"></Posts>
    <div class="text-center">
      <v-pagination v-model="page" :length="postPages" @input="changePage()"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Posts from "@/components/posts/Posts";

export default {
  components: {
    Posts
  },

  data() {
    return {
      page: parseInt(this.$route.params.page, 10) || 1,
      postPages: 0
    };
  },

  watch: {
    $route() {
      this.page = parseInt(this.$route.params.page, 10) || 1;
    }
  },

  methods: {
    changePage() {
      if (this.page === parseInt(this.$route.params.page, 10)) {
        return;
      }
      const route = {
        name: "numbers-facts",
        params: { page: this.page }
      };
      this.$router.push(route);
    }
  }
};
</script>

<style></style>
