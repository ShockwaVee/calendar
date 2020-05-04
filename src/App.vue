<template>
  <div id="app" class="u-b0">
    <Calendar />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Calendar from "@/Calendar.vue";

export default Vue.extend({
  name: "App",
  components: { Calendar }
});
</script>

<style lang="scss">
#app {
}
</style>
