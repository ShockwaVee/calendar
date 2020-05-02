<template>
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
</template>
<script lang="ts">
export default {
  name: "CalendarHeader",
  props: {
    calendarDays: {
      required: true
    }
  }
};
</script>
<style lang="scss" scoped>
.calendar {
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
}
</style>
