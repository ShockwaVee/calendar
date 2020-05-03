<template>
  <div>
    <div
      class="calendar__working-hours"
      v-if="calendarDay.workingHours"
      @click="onCreateEvent"
      :style="{
        height: workingHoursHeight,
        top: workingHoursTop
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
import EventBus, { EventBusEvents } from "@/helpers/EventBus";

export default Vue.extend({
  name: "CalendarCell",
  components: {
    CalendarEvent
  },
  props: ["calendarDay", "events"],
  computed: {
    workingHoursHeight(): string | number {
      if (this.calendarDay.workingHours == null) {
        return 0;
      }
      const toPixels =
        this.calendarDay.workingHours.to.hours * 40 +
        (this.calendarDay.workingHours.to.minutes / 60) * 40;
      const fromPixels =
        this.calendarDay.workingHours.from.hours * 40 +
        (this.calendarDay.workingHours.from.minutes / 60) * 40;
      return toPixels - fromPixels + "px";
    },
    workingHoursTop(): string | number {
      if (this.calendarDay.workingHours == null) {
        return 0;
      }
      const fromPixels =
        this.calendarDay.workingHours.from.hours * 40 +
        (this.calendarDay.workingHours.from.minutes / 60) * 40;
      return fromPixels + "px";
    },
    allEvents(): CalendarEvent[] {
      const allEvents = this.events;
      if (this.calendarDay.breakEvent) {
        allEvents.push(this.calendarDay.breakEvent);
      }
      return allEvents;
    }
  },
  methods: {
    onCreateEvent(event: MouseEvent) {
      const targetElement = event.target as HTMLElement | null;
      if (targetElement === null) {
        return;
      }
      EventBus.$emit(EventBusEvents.openModal, {
        yPosition: event.offsetY + targetElement.offsetTop,
        date: this.calendarDay
      });
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
