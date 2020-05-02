<template>
  <div id="app">
    <div class="calendar">
      <div class="calendar__header">
        <div class="calendar__header-title" v-if="calendarDays.length > 0">
          <h4>
            Tjedan {{ calendarDays[0].momentObject.format("ww") }} -
            {{ calendarDays[0].momentObject.format("yyyy") }}
          </h4>
        </div>
        <div class="calendar__header-cells">
          <div
            class="calendar__header-cell"
            v-for="calendarDay in calendarDays"
            :key="calendarDay.momentObject.format()"
          >
            <span>{{ calendarDay.momentObject.format("dddd DD") }}</span>
          </div>
        </div>
      </div>
      <div class="calendar__body">
        <div class="calendar__time-column">
          <div
            class="calendar__time-cell"
            v-for="hour in hoursInDay"
            :key="hour"
          >
            {{ formatTime(hour, 0) }}
          </div>
        </div>
        <div class="calendar__body-cells">
          <div
            class="calendar__body-cell"
            v-for="calendarDay in calendarDays"
            :key="calendarDay.momentObject.format()"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CalendarService } from "@/services/CalendarService";
import { formatHoursAndMinutes } from "@/helpers/DataFormatter";

export default Vue.extend({
  name: "App",
  data() {
    return {
      calendarService: null as null | CalendarService,
      calendarDays: [] as any[],
      hoursInDay: [...Array(24).keys()]
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
      if (this.calendarService == null) {
        console.error("CalendarService is not initialized.");
        return;
      }
      this.calendarDays = this.calendarService.generateNDays(7);
    },
    formatTime(hours: number, minutes = 0) {
      return formatHoursAndMinutes(hours, minutes);
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
  &__header {
    display: flex;
    flex-direction: column;
    padding-left: 42px;
  }
  &__header-cells {
    display: flex;
  }
  &__header-cell {
    flex: 0 0 120px;
    text-align: center;
    text-transform: capitalize;
  }
  &__header-title {
    padding: 12px 0;
    text-align: center;
    h4 {
      margin: 0;
      padding: 0;
    }
  }
  &__body {
    display: flex;
  }
  &__body-cells {
    display: flex;
    width: 100%;
  }
  &__body-cell {
    flex: 0 0 120px;
    border-right: 1px solid hsla(0, 0%, 76.9%, 0.3);
  }
  &__time-column {
    display: flex;
    flex-direction: column;
    width: 42px;
  }
  &__time-cell {
    height: 40px;
    border-right: 1px solid hsla(0, 0%, 76.9%, 0.3);
    &::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px solid hsla(0, 0%, 76.9%, 0.3);
    }
  }
}
</style>
