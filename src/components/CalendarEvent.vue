<template>
  <div
    class="calendar__event"
    @mouseenter="isTooltipVisible = true"
    @mouseleave="isTooltipVisible = false"
    :style="{
      height: workingHoursHeight,
      top: workingHoursTop
    }"
  >
    <transition name="slide-fade">
      <div v-show="isTooltipVisible" class="calendar__additional-info">
        <h6>{{ event.title }}</h6>
        <span
          >{{ event.momentObjectFrom.format("HH:mm") }} -
          {{ event.momentObjectTo.format("HH:mm") }}</span
        >
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CalendarEvent",
  props: ["event"],
  computed: {
    workingHoursHeight() {
      const toPixels =
        this.event.time.to.hours * 40 + (this.event.time.to.minutes / 60) * 40;
      const fromPixels =
        this.event.time.from.hours * 40 +
        (this.event.time.from.minutes / 60) * 40;
      return toPixels - fromPixels + "px";
    },
    workingHoursTop() {
      const fromPixels =
        this.event.time.from.hours * 40 +
        (this.event.time.from.minutes / 60) * 40;
      return fromPixels + "px";
    }
  },
  data() {
    return {
      isTooltipVisible: false
    };
  }
});
</script>
<style lang="scss" scoped>
.calendar {
  &__event {
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    background-color: red;
    border-radius: 3px;
    border: 1px solid black;
    cursor: pointer;
  }
  &__additional-info {
    top: -108px;
    position: absolute;
    width: 130px;
    height: 80px;
    background-color: white;
    z-index: 2;
    border: 2px solid black;
    padding: 5px;
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: calc(100% - 7.5px);
      width: 15px;
      left: 10px;
      height: 15px;
      background: #ffffff;
      border-left: 2px solid black;
      border-bottom: 2px solid black;
      transform: rotate(-45deg);
    }
  }
  h6 {
    margin: 0;
    padding-bottom: 16px;
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
