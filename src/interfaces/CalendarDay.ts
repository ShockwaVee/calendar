import { Moment } from "moment";
import { EventHours } from "@/interfaces/EventHours";

export interface CalendarDay {
  momentObject: Moment;
  workingHours: EventHours | null;
}
