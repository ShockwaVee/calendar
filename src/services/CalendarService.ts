import moment, { Moment } from "moment";
import { CalendarDay } from "@/interfaces/CalendarDay";
import { EventHours } from "@/interfaces/EventHours";
import { CalendarEvent } from "@/interfaces/CalendarEvent";

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
  private readonly breakUsual = {
    from: "11:00",
    to: "11:30"
  };
  private readonly breakAlternative = {
    from: "16:00",
    to: "16:30"
  };

  constructor(startingDate: Date) {
    this.startingDate = moment(startingDate);
  }

  public generateNDays(numberOfDays: number): CalendarDay[] {
    const calendarDays: CalendarDay[] = [];
    let currentDate = this.startingDate.clone();

    for (let i = 0; i < numberOfDays; i++) {
      let workingHours: EventHours | null = this.workingHoursUsual;
      const momentObjectFrom = currentDate.clone();
      const momentObjectTo = currentDate.clone();

      let breakEvent: CalendarEvent | null = CalendarService.constructEvent(
        momentObjectFrom,
        momentObjectTo,
        "Pauza",
        this.breakUsual.from,
        this.breakUsual.to
      );

      if (currentDate.date() % 2) {
        workingHours = this.workingHoursAlternative;
        breakEvent = CalendarService.constructEvent(
          momentObjectFrom,
          momentObjectTo,
          "Pauza",
          this.breakAlternative.from,
          this.breakAlternative.to
        );
      }
      if (
        currentDate.weekday() === 6 ||
        (currentDate.weekday() === 5 && currentDate.date() % 2 !== 0)
      ) {
        workingHours = null;
        breakEvent = null;
      }

      calendarDays.push({
        momentObject: currentDate,
        workingHours,
        breakEvent
      });
      currentDate = currentDate.clone().add(1, "d");
    }
    return calendarDays;
  }

  private static constructEvent(
    momentObjectFrom: Moment,
    momentObjectTo: Moment,
    title: string,
    fromDateString: string,
    toDateString: string
  ) {
    const [fromHours, fromMinutes] = [...fromDateString.split(":")];
    const [toHours, toMinutes] = [...toDateString.split(":")];
    momentObjectFrom.hour(+fromHours);
    momentObjectFrom.minutes(+fromMinutes);
    momentObjectTo.hour(+toHours);
    momentObjectTo.minutes(+toMinutes);
    return {
      title,
      time: {
        from: +fromHours * 40 + (+fromMinutes / 60) * 40,
        to: +toHours * 40 + (+toMinutes / 60) * 40
      },
      momentObjectFrom,
      momentObjectTo
    };
  }
}
