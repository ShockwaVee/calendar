<template>
  <div
    class="calendar__event"
    @mouseenter="isTooltipVisible = true"
    @mouseleave="isTooltipVisible = false"
    :style="{
      height: event.time.to - event.time.from + 'px',
      top: event.time.from + 'px'
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
    width: calc(100% - 2px);
    position: absolute;
    background-color: red;
    border-radius: 4px;
    border: 1px solid crimson;
    cursor: pointer;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
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
