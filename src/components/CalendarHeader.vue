<template>
  <div class="calendar__header">
    <div class="calendar__header-title" v-if="calendarDays.length > 0">
      <h4 class="u-a3">
        {{ calendarHeaderTitle }}
      </h4>
    </div>
    <div class="calendar__header-cells">
      <div
        class="calendar__header-cell u-a1"
        v-for="calendarDay in calendarDays"
        :key="calendarDay.momentObject.format()"
      >
        <span>{{
          isSmallScreenSize
            ? calendarDay.momentObject.format("Do")
            : calendarDay.momentObject.format("dddd Do")
        }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CalendarHeader",
  data() {
    return {
      windowWidth: 0
    };
  },
  props: ["calendarDays"],
  computed: {
    isSmallScreenSize(): boolean {
      return this.windowWidth <= 650;
    },
    calendarHeaderTitle(): string {
      if (this.calendarDays.length <= 0) {
        return "";
      }
      const monthRange = new Set();
      monthRange.add(this.calendarDays[0].momentObject.format("MMMM"));
      monthRange.add(
        this.calendarDays.slice(-1)[0].momentObject.format("MMMM")
      );
      return `${[...monthRange].join(
        " - "
      )} - ${this.calendarDays[0].momentObject.format("yyyy")}.`;
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.windowWidth = window.innerWidth;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  }
});
</script>
<style lang="scss" scoped>
.calendar {
  &__header {
    display: flex;
    flex-direction: column;
  }

  &__header-cells {
    display: flex;
    padding-left: 40px;
  }

  &__header-cell {
    width: 100%;
    text-align: center;
    text-transform: capitalize;
    padding: 8px 0;
  }

  &__header-title {
    text-align: center;

    h4 {
      border-bottom: 1px solid $silver;
      padding-bottom: 8px;
    }
  }
}
</style>
