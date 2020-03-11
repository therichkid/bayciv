<template>
  <div>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      hide-no-data
      item-text="Description"
      item-value="API"
      placeholder="Nach Artikeln & Events suchen"
      solo
      :light="!$vuetify.theme.dark"
      v-if="!isHidden"
      prepend-inner-icon="mdi-arrow-left"
      @click:prepend-inner="toggleSearchBar()"
    >
    </v-autocomplete>
    <v-btn icon text @click.stop="toggleSearchBar()" v-if="isHidden">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      isHidden: true,
      model: null,
      search: null
    };
  },

  computed: {
    items() {
      return this.entries.map(entry => {
        const Description =
          entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + "..."
            : entry.Description;
        return Object.assign({}, entry, { Description });
      });
    }
  },

  watch: {
    search(val) {
      console.log("Searching", val);
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch("https://api.publicapis.org/entries")
        .then(res => res.json())
        .then(res => {
          const { entries } = res;
          this.entries = entries;
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => (this.isLoading = false));
    },
    model(val) {
      console.log("Model changed", val);
    }
  },

  methods: {
    toggleSearchBar() {
      this.isHidden = !this.isHidden;
    }
  }
};
</script>

<style></style>
