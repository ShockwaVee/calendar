<template>
  <div>
    <div
      class="calendar__working-hours"
      data-test="working-hours"
      v-if="calendarDay.workingHours"
      @click="onCreateEvent"
      :style="{
        height: workingHoursHeight,
        top: workingHoursTop
      }"
    ></div>
    <CalendarEvent
      v-for="(event, index) in allEvents"
      :calendarDay="calendarDay"
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
import {
  convertTimeToHeightPixels,
  convertTimeToTopPixels
} from "@/helpers/DataFormatter";

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
      const toPixels = convertTimeToHeightPixels(
        this.calendarDay.workingHours.to.hours,
        this.calendarDay.workingHours.to.minutes
      );
      const fromPixels = convertTimeToHeightPixels(
        this.calendarDay.workingHours.from.hours,
        this.calendarDay.workingHours.from.minutes
      );
      return toPixels - fromPixels + "px";
    },
    workingHoursTop(): string | number {
      if (this.calendarDay.workingHours == null) {
        return 0;
      }
      const fromPixels = convertTimeToTopPixels(
        this.calendarDay.workingHours.from.hours,
        this.calendarDay.workingHours.from.minutes
      );
      return fromPixels + "px";
    },
    allEvents() {
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
    cursor: pointer;
  }
}
</style>
