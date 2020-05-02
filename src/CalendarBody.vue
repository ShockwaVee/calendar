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
        :key="calendarDay.momentObject.format()"
      >
        <CalendarCell :calendar-day="calendarDay"></CalendarCell>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { formatHoursAndMinutes } from "@/helpers/DataFormatter";
import CalendarCell from "@/components/CalendarCell.vue";

export default Vue.extend({
  name: "CalendarBody",
  components: {
    CalendarCell
  },
  data() {
    return {
      hoursInDay: [...Array(24).keys()]
    };
  },
  props: {
    calendarDays: {
      required: true
    }
  },
  methods: {
    formatTime(hours: number, minutes = 0) {
      return formatHoursAndMinutes(hours, minutes);
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
    height: 40px;
    border-right: 1px solid black;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px solid black;
    }
  }
}
</style>
