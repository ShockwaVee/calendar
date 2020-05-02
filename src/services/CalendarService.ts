import moment, { Moment } from "moment";
import { CalendarDay } from "@/interfaces/CalendarDay";

export class CalendarService {
  private readonly startingDate: Moment;

  constructor(startingDate: Date) {
    this.startingDate = moment(startingDate);
  }

  public generateNDays(numberOfDays: number): CalendarDay[] {
    const calendarDays: CalendarDay[] = [];
    let currentDate = this.startingDate.clone();

    for (let i = 0; i < numberOfDays; i++) {
      calendarDays.push({
        momentObject: currentDate
      });
      currentDate = currentDate.clone().add(1, "d");
    }
    return calendarDays;
  }
}
