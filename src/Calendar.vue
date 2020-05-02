<template>
  <div class="calendar">
    <CalendarHeader :calendar-days="calendarDays" />
    <CalendarBody :calendar-days="calendarDays" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { CalendarService } from "@/services/CalendarService";
import { CalendarDay } from "@/interfaces/CalendarDay";
import CalendarHeader from "@/CalendarHeader.vue";
import CalendarBody from "@/CalendarBody.vue";

export default Vue.extend({
  name: "Calendar",
  components: { CalendarBody, CalendarHeader },
  data() {
    return {
      calendarService: null as null | CalendarService,
      calendarDays: [] as CalendarDay[]
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
