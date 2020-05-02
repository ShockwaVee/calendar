import { Moment } from "moment";
import { EventHours } from "@/interfaces/EventHours";
import { CalendarEvent } from "@/interfaces/CalendarEvent";

export interface CalendarDay {
  momentObject: Moment;
  workingHours: EventHours | null;
  breakEvent: CalendarEvent | null;
}
