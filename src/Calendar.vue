<template>
  <div class="calendar">
    <CalendarHeader :calendar-days="calendarDays" />
    <CalendarBody :calendar-days="calendarDays" :events="events" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { CalendarService } from "@/services/CalendarService";
import { CalendarDay } from "@/interfaces/CalendarDay";
import CalendarHeader from "@/CalendarHeader.vue";
import CalendarBody from "@/CalendarBody.vue";
import { CalendarEvent } from "@/interfaces/CalendarEvent";

export default Vue.extend({
  name: "Calendar",
  components: { CalendarBody, CalendarHeader },
  data() {
    return {
      calendarService: null as null | CalendarService,
      calendarDays: [] as CalendarDay[],
      events: [] as CalendarEvent[]
    };
  },
  created() {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    this.calendarService = new CalendarService(tomorrow);
    this.constructCalendar();
  },
  methods: {
    constructCalendar() {
      const generatedEvents: CalendarEvent[] = [];
      if (this.calendarService == null) {
        console.error("CalendarService is not initialized.");
        return;
      }
      this.calendarDays = this.calendarService.generateNDays(7);
      while (generatedEvents.length < 15) {
        const generatedDate = CalendarService.generateRandomDate(
          this.calendarDays[0].momentObject,
          this.calendarDays[6].momentObject
        );
        const calendarDay = this.calendarDays.find(
          (calendarDay: CalendarDay) => {
            return calendarDay.momentObject.isSame(generatedDate, "day");
          }
        );
        if (calendarDay == null) {
          return;
        }
        const generatedEndDate = generatedDate.clone().add(30, "minutes");
        const generatedEvent = CalendarService.constructEvent(
          "test",
          {
            hours: generatedDate.hour(),
            minutes: generatedDate.minute(),
            date: generatedDate.format("MM/DD/YYYY")
          },
          {
            hours: generatedEndDate.hour(),
            minutes: generatedEndDate.minute(),
            date: generatedEndDate.format("MM/DD/YYYY")
          }
        );
        if (
          CalendarService.validateEvent(generatedEvent, calendarDay) &&
          !CalendarService.validateOverlapping(
            generatedEvent,
            generatedEvents,
            calendarDay
          )
        ) {
          generatedEvents.push(generatedEvent);
        }
      }
      this.events = generatedEvents;
    }
  }
});
</script>
<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  width: 886px;
  position: relative;
}
</style>
