<template>
  <div style="width: 60%; max-width: 600px;">
    <v-autocomplete
      v-if="!isHidden"
      v-model="model"
      :loading="isLoading"
      :search-input.sync="search"
      :items="items"
      item-text="title.rendered"
      item-value="slug"
      hide-no-data
      hide-details
      placeholder="Nach Artikeln suchen"
      solo
      :light="!$vuetify.theme.dark"
      prepend-inner-icon="mdi-arrow-left"
      @click:prepend-inner="toggleSearchBar()"
    >
    </v-autocomplete>
    <v-btn icon text v-if="isHidden" @click.stop="toggleSearchBar()" style="float: right;">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      isLoading: false,
      isHidden: true,
      model: null,
      search: null
    };
  },

  watch: {
    async search(value) {
      // TODO: search events also and add debouncer
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.items = await this.$store
        .dispatch("fetchPostsBySearchTerm", value)
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false;
        });
    },
    model(slug) {
      if (slug) {
        this.$router.push(`/news/${slug}`);
      }
    }
  },

  methods: {
    toggleSearchBar() {
      this.isHidden = !this.isHidden;
      if (this.isHidden) {
        this.model = null;
      }
    }
  }
};
</script>

<style></style>
