<template>
  <div id="app">
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
