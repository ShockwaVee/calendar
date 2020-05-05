import Vue from "vue";
const EventBus = new Vue();
export default EventBus;

export const EventBusEvents = {
  openModal: "openModal",
  addEvent: "addEvent",
  editEvent: "editEvent",
  deleteEvent: "deleteEvent"
};
