import { EventHoursInput } from "@/interfaces/EventHoursInput";

export interface EventConstructor {
  title: string;
  from: EventHoursInput;
  to?: EventHoursInput;
  isUserGenerated?: boolean;
  isBreak?: boolean;
}
