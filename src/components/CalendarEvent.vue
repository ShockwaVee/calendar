<template>
  <div
    class="calendar__event u-b1"
    :class="{
      'is-user-generated': event.isUserGenerated,
      'is-break': event.isBreak
    }"
    @mouseenter="isTooltipVisible = true"
    @mouseleave="isTooltipVisible = false"
    :style="{
      height: eventHeight,
      top: eventTop
    }"
  >
    <p class="calendar__event-name">{{ event.title }}</p>
    <transition name="slide-fade">
      <div v-show="isTooltipVisible" class="calendar__additional-info">
        <h6 class="u-a3">{{ event.title }}</h6>
        <span class="u-b0"
          >{{ event.momentObjectFrom.format("HH:mm") }} -
          {{ event.momentObjectTo.format("HH:mm") }}</span
        >
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  convertTimeToHeightPixels,
  convertTimeToTopPixels
} from "@/helpers/DataFormatter";

export default Vue.extend({
  name: "CalendarEvent",
  props: ["event"],
  computed: {
    eventHeight(): string {
      const toPixels = convertTimeToHeightPixels(
        this.event.time.to.hours,
        this.event.time.to.minutes
      );
      const fromPixels = convertTimeToHeightPixels(
        this.event.time.from.hours,
        this.event.time.from.minutes
      );
      return toPixels - fromPixels + "px";
    },
    eventTop(): string {
      const fromPixels = convertTimeToTopPixels(
        this.event.time.from.hours,
        this.event.time.from.minutes
      );
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
    background-color: $mpink;
    border-radius: 3px;
    border-top: 1px solid $white;
    cursor: pointer;
    display: flex;
    padding: 0 4px;
    transition: background-color 0.3s ease-in-out;
    &:hover {
      background-color: $pink;
    }
    &.is-user-generated {
      background-color: $gainsboro;
      &:hover {
        background-color: $lighter-gainsboro;
      }
    }
    &.is-break {
      background-color: $blue;
      &:hover {
        background-color: $darker-blue;
      }
    }
  }
  &__event-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: auto 0;
    color: white;
  }
  &__additional-info {
    top: -108px;
    position: absolute;
    width: 130px;
    background-color: $white;
    z-index: 2;
    border: 2px solid $black;
    border-radius: 4px;
    padding: 10px 5px;
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: calc(100% - 6px);
      width: 15px;
      left: 10px;
      height: 15px;
      background: #ffffff;
      border-left: 2px solid $black;
      border-bottom: 2px solid $black;
      transform: rotate(-45deg);
    }
  }
  h6 {
    color: $lpink;
    padding-bottom: 8px;
    word-break: break-all;
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
