<template>
  <div class="calendar__body">
    <div class="calendar__time-column">
      <div class="calendar__time-cell" v-for="hour in hoursInDay" :key="hour">
        {{ formatTime(hour) }}
      </div>
    </div>
    <div class="calendar__body-cells">
      <div
        class="calendar__body-cell"
        v-for="calendarDay in calendarDays"
        :key="calendarDay.momentObject.valueOf()"
      >
        <CalendarCell
          :calendar-day="calendarDay"
          :events="getEventsForDay(calendarDay)"
        ></CalendarCell>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { formatHoursAndMinutes } from "@/helpers/DataFormatter";
import CalendarCell from "@/components/CalendarCell.vue";
import { CalendarDay } from "@/interfaces/CalendarDay";
import { CalendarEvent } from "@/interfaces/CalendarEvent";

export default Vue.extend({
  name: "CalendarBody",
  components: {
    CalendarCell
  },
  data() {
    return {
      hoursInDay: [...Array(24).keys()].filter(n => n >= 7 && n <= 20)
    };
  },
  props: ["calendarDays", "events"],
  methods: {
    formatTime(hours: number, minutes = 0) {
      return formatHoursAndMinutes(hours, minutes);
    },
    getEventsForDay(currentDay: CalendarDay) {
      return this.events.filter((calendarEvent: CalendarEvent) => {
        return calendarEvent.momentObjectFrom.isSame(
          currentDay.momentObject,
          "day"
        );
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.calendar {
  &__body {
    display: flex;
  }

  &__body-cells {
    display: flex;
    width: 100%;
  }

  &__body-cell {
    flex: 0 0 120px;
    border-right: 1px solid black;
    background-color: rgba(211, 211, 211, 0.81);
    position: relative;
  }

  &__time-column {
    display: flex;
    flex-direction: column;
    width: 42px;
    z-index: 1;
  }

  &__time-cell {
    height: 60px;
    border-right: 1px solid black;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px solid black;
      pointer-events: none;
    }
  }
}
</style>
