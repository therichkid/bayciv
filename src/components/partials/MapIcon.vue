<template>
  <l-icon :icon-size="[40, 62]" :icon-anchor="[20, 62]" :popup-anchor="[0, -40]">
    <div :class="{ bounce: isActive }">
      <img
        src="../../assets/map/beratungsstelle.png"
        :alt="group.type"
        height="62px"
        width="40px"
        v-if="group.type === 'Beratungsstelle'"
      />
      <img
        src="../../assets/map/klinik.png"
        :alt="group.type"
        height="62px"
        width="40px"
        v-else-if="group.type === 'Klinik'"
      />
      <img
        src="../../assets/map/reha.png"
        :alt="group.type"
        height="62px"
        width="40px"
        v-else-if="group.type === 'Reha'"
      />
      <img
        src="../../assets/map/shg_online.png"
        :alt="group.type"
        height="62px"
        width="40px"
        v-else-if="group.onlineGroup"
      />
      <img src="../../assets/map/shg.png" :alt="group.type" height="62px" width="40px" v-else />
    </div>
  </l-icon>
</template>

<script>
import { LIcon } from "vue2-leaflet";

export default {
  components: {
    LIcon
  },

  props: {
    group: Object,
    isActive: Boolean
  }
};
</script>

<style scoped>
@keyframes bounce {
  0% {
    transform: scale(1, 1) translate(0px, 0px);
  }
  30% {
    transform: scale(1, 0.8) translate(0px, 10px);
  }
  75% {
    transform: scale(1, 1.1) translate(0px, -25px);
  }
  100% {
    transform: scale(1, 1) translate(0px, 0px);
  }
}
.bounce {
  animation: bounce 0.75s 5;
}
</style>
