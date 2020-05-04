import { EventHours } from "@/interfaces/EventHours";
import { Moment } from "moment";

export interface CalendarEvent {
  time: EventHours;
  title: string;
  momentObjectFrom: Moment;
  momentObjectTo: Moment;
  isUserGenerated: boolean;
  isBreak?: boolean;
}
