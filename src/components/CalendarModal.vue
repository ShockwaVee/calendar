<template>
  <div v-show="isVisible" class="modal__wrapper" @click.self.capture="onClose">
    <div class="modal">
      <input type="date" v-model="eventInfo.date" />
      <input type="text" v-model="eventInfo.hours" />
      <input type="text" v-model="eventInfo.minutes" />
      <button @click="onClose">X</button>
      <button @click="onCreateEvent">Stvori</button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import EventBus, { EventBusEvents } from "@/helpers/EventBus";
import moment, { Moment } from "moment";
import { CalendarService } from "@/services/CalendarService";
import { CalendarDay } from "@/interfaces/CalendarDay";

export default Vue.extend({
  name: "CalendarModal",
  props: ["events"],
  data() {
    return {
      isVisible: false,
      eventInfo: {
        date: new Date(),
        hours: "",
        minutes: ""
      },
      calendarDay: null as null | CalendarDay
    };
  },
  methods: {
    onClose() {
      this.isVisible = false;
    },
    onOpen({ yPosition, date }: { yPosition: number; date: CalendarDay }) {
      this.isVisible = true;
      const hours = Math.floor(yPosition / 40);
      const minutes = Math.floor(+(yPosition / 40 - hours).toFixed(3) * 60);
      this.eventInfo.hours = hours < 10 ? `0${hours}` : String(hours);
      this.eventInfo.minutes = minutes < 10 ? `0${minutes}` : String(minutes);
      this.eventInfo.date = date.momentObject.toDate();
      this.calendarDay = date;
    },
    createEvent(hours: number, minutes: number, date: Moment) {
      return CalendarService.constructEvent({
        title: "test",
        from: {
          hours,
          minutes,
          date: date.format("MM/DD/YYYY")
        },
        isUserGenerated: true
      });
    },
    onCreateEvent() {
      if (this.calendarDay == null) {
        return;
      }
      const newEvent = this.createEvent(
        +this.eventInfo.hours,
        +this.eventInfo.minutes,
        moment(this.eventInfo.date)
      );
      const isValidEventPlacement = CalendarService.validateMaximumNumberOfEvents(
        newEvent,
        this.events
      );
      if (typeof isValidEventPlacement === "string") {
        this.$toasted.error(isValidEventPlacement);
        return;
      }
      if (!CalendarService.validateEvent(newEvent, this.calendarDay)) {
        this.$toasted.error(
          "Vrijeme termina nije ispravno. Molimo provjerite da se nalazi unutar radnog vremena."
        );
        return;
      }
      if (
        CalendarService.validateOverlapping(
          newEvent,
          [...this.events, this.calendarDay.breakEvent],
          this.calendarDay
        )
      ) {
        this.$toasted.error(
          "Vrijeme termina se preklapa s postojećim terminom. Morate zakazati slobodan termin!"
        );
        return;
      }
      this.$emit(EventBusEvents.addEvent, newEvent);
      this.onClose();
    }
  },
  created() {
    EventBus.$on(EventBusEvents.openModal, this.onOpen);
  },
  beforeDestroy() {
    EventBus.$off(EventBusEvents.openModal, this.onOpen);
  }
});
</script>
<style lang="scss" scoped>
.modal {
  width: 400px;
  height: 200px;
  background: white;
  z-index: 21;
  &__wrapper {
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 20;
    justify-content: center;
    align-items: center;
  }
}
</style>
