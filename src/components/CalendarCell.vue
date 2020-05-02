<template>
  <div>
    <div
      class="calendar__working-hours"
      v-if="calendarDay.workingHours"
      :style="{
        height:
          calendarDay.workingHours.to - calendarDay.workingHours.from + 'px',
        top: calendarDay.workingHours.from + 'px'
      }"
    ></div>
    <CalendarEvent
      v-for="(event, index) in allEvents"
      :event="event"
      :key="index"
    >
    </CalendarEvent>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CalendarEvent from "@/components/CalendarEvent.vue";

export default Vue.extend({
  name: "CalendarCell",
  components: {
    CalendarEvent
  },
  props: ["calendarDay"],
  computed: {
    allEvents(): any[] {
      const allEvents = [];
      if (this.calendarDay.breakEvent) {
        allEvents.push(this.calendarDay.breakEvent);
      }
      return allEvents;
    }
  }
});
</script>
<style lang="scss" scoped>
.calendar {
  &__working-hours {
    width: 100%;
    position: absolute;
    background-color: white;
  }
}
</style>
