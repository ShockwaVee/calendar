<template>
  <div
    class="calendar__event u-b1"
    :data-test="event.isUserGenerated ? 'user-event' : 'generated-event'"
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
        <template v-if="event.isUserGenerated">
          <button
            class="calendar__delete-button u-a1"
            @click="onDeleteEvent(event)"
            data-test="delete-event"
          >
            Obriši
          </button>
        </template>
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
import EventBus, { EventBusEvents } from "@/helpers/EventBus";
import { CalendarEvent } from "@/interfaces/CalendarEvent";

export default Vue.extend({
  name: "CalendarEvent",
  props: ["event", "calendarDay"],
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
  },
  methods: {
    onDeleteEvent(event: CalendarEvent) {
      EventBus.$emit(EventBusEvents.deleteEvent, event);
    }
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
    top: -112px;
    height: auto;
    position: absolute;
    min-width: 200px;
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
    @include mq(lg) {
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      &:after {
        content: none;
      }
    }
  }
  h6 {
    color: $lpink;
    padding-bottom: 8px;
    word-break: break-all;
  }
  &__delete-button {
    padding: 4px 0;
    display: block;
    width: 50%;
    margin: 16px auto 0 auto;
    background-color: $mpink;
    border: 1px solid $darker-mpink;
    border-radius: 2px;
    cursor: pointer;
    color: $white;
    transition: background-color 0.3s ease-in-out;
    &:hover {
      background-color: $darker-mpink;
    }
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
