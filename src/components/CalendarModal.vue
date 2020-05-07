<template>
  <div v-show="isVisible" class="modal__wrapper">
    <div class="modal">
      <h6 class="u-a2 modal__title">Rezerviraj novi termin</h6>
      <label class="modal-row">
        <span>Naziv</span>
        <input
          data-test="title"
          maxlength="30"
          type="text"
          v-model="eventInfo.title"
        />
      </label>
      <label class="modal-row">
        <span>Datum</span>
        <DatePicker
          data-test="date"
          v-model="eventInfo.date"
          format="DD.MM.YYYY."
        ></DatePicker>
      </label>
      <label class="modal-row">
        <span>Sati i minute</span>
        <DatePicker
          v-model="eventInfo.hoursAndMinutes"
          data-test="hoursAndMinutes"
          type="time"
          :show-time-header="true"
          time-title-format="DD.MM.YYYY."
          format="HH:mm"
        ></DatePicker>
      </label>
      <button class="modal__close-button" @click="onClose">×</button>
      <button
        class="modal__button u-a3"
        @click="onCreateEvent"
        data-test="create-button"
      >
        Stvori
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import EventBus, { EventBusEvents } from "@/helpers/EventBus";
import moment, { Moment } from "moment";
import { CalendarService } from "@/services/CalendarService";
import { CalendarDay } from "@/interfaces/CalendarDay";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/hr";

export default Vue.extend({
  name: "CalendarModal",
  props: ["events"],
  components: {
    DatePicker
  },
  data() {
    return {
      isVisible: false,
      eventInfo: {
        date: new Date(),
        title: "",
        hoursAndMinutes: new Date()
      },
      calendarDay: null as null | CalendarDay,
      calendarService: null as null | CalendarService
    };
  },
  methods: {
    onClose() {
      this.eventInfo.title = "";
      this.isVisible = false;
    },
    onOpen({ yPosition, date }: { yPosition: number; date: CalendarDay }) {
      this.isVisible = true;
      const hours = Math.floor(yPosition / 60 + 7);
      const minutes = yPosition % 60;
      const dateObject = date.momentObject
        .clone()
        .hour(hours)
        .minute(minutes);
      this.eventInfo.date = dateObject.toDate();
      this.eventInfo.hoursAndMinutes = dateObject.toDate();
      this.calendarDay = date;
    },
    createEvent(hours: number, minutes: number, date: Moment) {
      if (this.eventInfo.title.trim().length <= 0) {
        this.$toasted.error("Molimo da ispravno upišete naziv termina");
        return;
      }
      return CalendarService.constructEvent({
        title: this.eventInfo.title,
        from: {
          hours,
          minutes,
          date: date.format("MM/DD/YYYY")
        },
        isUserGenerated: true
      });
    },
    onCreateEvent() {
      if (this.calendarDay == null || this.calendarService == null) {
        return;
      }
      const currentDay = this.calendarService.generateDay(
        moment(this.eventInfo.date)
      );
      const hoursAndMinutes = moment(this.eventInfo.hoursAndMinutes);
      const newEvent = this.createEvent(
        hoursAndMinutes.hours(),
        +hoursAndMinutes.minutes(),
        moment(this.eventInfo.date)
      );
      if (newEvent == null) {
        return;
      }
      const isValidEventPlacement = CalendarService.validateMaximumNumberOfEvents(
        newEvent,
        this.events
      );
      if (typeof isValidEventPlacement === "string") {
        this.$toasted.error(isValidEventPlacement);
        return;
      }
      if (!CalendarService.validateEvent(newEvent, currentDay)) {
        this.$toasted.error(
          "Vrijeme termina nije ispravno. Molimo provjerite da se nalazi unutar radnog vremena."
        );
        return;
      }
      if (
        CalendarService.validateOverlapping(
          newEvent,
          [...this.events, currentDay.breakEvent],
          currentDay
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
    this.calendarService = new CalendarService();
  },
  beforeDestroy() {
    EventBus.$off(EventBusEvents.openModal, this.onOpen);
  }
});
</script>
<style lang="scss" scoped>
.modal {
  position: relative;
  width: 400px;
  background: white;
  z-index: 21;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px;
  &__title {
    padding-bottom: 24px;
    text-align: center;
  }
  .modal-row {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    justify-content: space-between;
    span {
      margin-right: 16px;
    }
    input {
      flex: 1 0 auto;
    }
    &--small {
      justify-content: space-between;
      input {
        max-width: 60px;
      }
    }
  }
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

  &__close-button {
    position: absolute;
    top: 6px;
    right: 4px;
    border: none;
    background-color: transparent;
    font-size: 40px;
    cursor: pointer;
    line-height: 16px;
    transition: color 0.3s ease-in-out;
    &:hover {
      color: $mpink;
    }
  }

  &__button {
    margin-top: 16px;
    padding: 8px 0;
    background-color: $blue;
    border: 1px solid $darker-blue;
    border-radius: 2px;
    cursor: pointer;
    color: $white;
    transition: background-color 0.3s ease-in-out;
    &:hover {
      background-color: $darker-blue;
    }
  }
}
</style>
