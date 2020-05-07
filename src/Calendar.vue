<template>
  <div class="calendar">
    <CalendarHeader :calendar-days="calendarDays" />
    <CalendarBody :calendar-days="calendarDays" :events="events" />
    <CalendarModal @addEvent="onAddEvent" :events="events"></CalendarModal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { CalendarService } from "@/services/CalendarService";
import { CalendarDay } from "@/interfaces/CalendarDay";
import CalendarHeader from "@/components/CalendarHeader.vue";
import CalendarBody from "@/components/CalendarBody.vue";
import { CalendarEvent } from "@/interfaces/CalendarEvent";
import CalendarModal from "@/components/CalendarModal.vue";
import EventBus, { EventBusEvents } from "@/helpers/EventBus";

export default Vue.extend({
  name: "Calendar",
  components: { CalendarBody, CalendarHeader, CalendarModal },
  data() {
    return {
      calendarService: null as null | CalendarService,
      calendarDays: [] as CalendarDay[],
      events: [] as CalendarEvent[]
    };
  },
  created() {
    EventBus.$on(EventBusEvents.deleteEvent, this.onDeleteEvent);
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
          this.calendarDays.slice(-1)[0].momentObject
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
        const generatedEvent = CalendarService.constructEvent({
          title: `Termin ${generatedEvents.length}`,
          from: {
            hours: generatedDate.hour(),
            minutes: generatedDate.minute(),
            date: generatedDate.format("MM/DD/YYYY")
          },
          to: {
            hours: generatedEndDate.hour(),
            minutes: generatedEndDate.minute(),
            date: generatedEndDate.format("MM/DD/YYYY")
          }
        });
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
    },
    onAddEvent(newEvent: CalendarEvent) {
      this.events.push(newEvent);
    },
    onDeleteEvent(event: CalendarEvent) {
      const eventIndex = this.events.findIndex(
        (calendarEvent: CalendarEvent) => {
          return calendarEvent.momentObjectFrom.isSame(event.momentObjectFrom);
        }
      );
      if (eventIndex === -1) {
        return;
      }
      this.events.splice(eventIndex, 1);
    }
  },
  beforeDestroy() {
    EventBus.$off(EventBusEvents.deleteEvent, this.onDeleteEvent);
  }
});
</script>
<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  @include mq(lg) {
    padding: 0 10px;
  }
}
</style>
