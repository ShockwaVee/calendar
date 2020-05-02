import moment, { Moment } from "moment";
import { CalendarDay } from "@/interfaces/CalendarDay";
import { EventHours } from "@/interfaces/EventHours";

export class CalendarService {
  private readonly startingDate: Moment;
  private readonly workingHoursUsual = {
    from: 8 * 40,
    to: 14 * 40
  };
  private readonly workingHoursAlternative = {
    from: 13 * 40,
    to: 19 * 40
  };

  constructor(startingDate: Date) {
    this.startingDate = moment(startingDate);
  }

  public generateNDays(numberOfDays: number): CalendarDay[] {
    const calendarDays: CalendarDay[] = [];
    let currentDate = this.startingDate.clone();

    for (let i = 0; i < numberOfDays; i++) {
      let workingHours: EventHours | null = this.workingHoursUsual;
      if (currentDate.date() % 2) {
        workingHours = this.workingHoursAlternative;
      }
      if (
        currentDate.weekday() === 6 ||
        (currentDate.weekday() === 5 && currentDate.date() % 2 !== 0)
      ) {
        workingHours = null;
      }

      calendarDays.push({
        momentObject: currentDate,
        workingHours
      });
      currentDate = currentDate.clone().add(1, "d");
    }
    return calendarDays;
  }
}
