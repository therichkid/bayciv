<template>
  <div v-if="images && images.length">
    <v-carousel
      hide-delimiters
      v-model="activeImage"
      :height="$vuetify.breakpoint.smAndUp ? 550 : 275"
    >
      <v-carousel-item
        v-for="(image, i) in images"
        :key="i"
        :src="image.url"
        :lazy-src="image.lazyUrl"
        :alt="image.title"
        contain
      >
        <v-container class="fill-height align-end">
          <v-row>
            <v-col cols="12" class="image-caption" v-if="image.caption.length">
              <span class="text-subtitle-1">{{ image.caption }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-carousel-item>
    </v-carousel>

    <div
      ref="previewContainer"
      class="preview-container"
      @mouseenter="setScrollDirection('hor')"
      @mouseleave="setScrollDirection('vert')"
    >
      <div v-for="(image, i) in images" :key="i" class="preview-image" @click="activeImage = i">
        <v-hover v-slot="{ hover }">
          <img
            :src="image.previewUrl"
            :alt="image.title"
            width="90"
            height="90"
            :class="{ active: i === activeImage, hovered: hover }"
          />
        </v-hover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: Array
  },

  data() {
    return {
      activeImage: 0
    };
  },

  watch: {
    activeImage() {
      this.scrollActiveImageIntoView();
    }
  },

  methods: {
    setScrollDirection(direction) {
      if (direction === "hor") {
        window.addEventListener("wheel", this.scrollHorizontally, { passive: false });
      } else {
        window.removeEventListener("wheel", this.scrollHorizontally);
      }
    },
    scrollHorizontally(event) {
      event.preventDefault();
      const container = this.$refs.previewContainer;
      if (event.deltaY > 0) {
        container.scrollLeft += 250;
      } else {
        container.scrollLeft -= 250;
      }
    },
    scrollActiveImageIntoView() {
      const container = this.$refs.previewContainer;
      const imageXStart = this.activeImage * 100;
      const imageXEnd = (this.activeImage + 1) * 100;
      if (imageXStart < container.scrollLeft) {
        // Scroll back
        container.scrollLeft = imageXEnd - container.offsetWidth;
      } else if (imageXEnd > container.scrollLeft + container.offsetWidth) {
        // Scroll forward
        container.scrollLeft = imageXStart;
      }
    }
  },

  destroyed() {
    window.removeEventListener("wheel", this.scrollHorizontally);
  }
};
</script>

<style scoped>
.image-caption {
  padding: 10px 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}
.preview-container {
  padding-top: 10px;
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
}
.preview-image {
  display: inline;
  padding: 0 5px;
  cursor: pointer;
}
.preview-image .active {
  outline: 5px solid var(--v-primary-base);
}
.preview-image .hovered {
  opacity: 0.75;
}
</style>
