import moment, { Moment } from "moment";
import { CalendarDay } from "@/interfaces/CalendarDay";
import { EventHours } from "@/interfaces/EventHours";
import { CalendarEvent } from "@/interfaces/CalendarEvent";
import { EventHoursInput } from "@/interfaces/EventHoursInput";

export class CalendarService {
  private readonly startingDate: Moment;
  private readonly workingHoursUsual = {
    from: {
      hours: 8,
      minutes: 0
    },
    to: {
      hours: 14,
      minutes: 0
    }
  };
  private readonly workingHoursAlternative = {
    from: {
      hours: 13,
      minutes: 0
    },
    to: {
      hours: 19,
      minutes: 0
    }
  };
  private readonly breakUsual = {
    from: {
      hours: 11,
      minutes: 0
    },
    to: {
      hours: 11,
      minutes: 30
    }
  };
  private readonly breakAlternative = {
    from: {
      hours: 16,
      minutes: 0
    },
    to: {
      hours: 16,
      minutes: 30
    }
  };

  constructor(startingDate: Date) {
    this.startingDate = moment(startingDate);
  }

  public generateNDays(numberOfDays: number): CalendarDay[] {
    const calendarDays: CalendarDay[] = [];
    let currentDate = this.startingDate.clone();

    for (let i = 0; i < numberOfDays; i++) {
      let workingHours: EventHours | null = this.workingHoursUsual;
      const from: EventHoursInput = {
        hours: this.breakUsual.from.hours,
        minutes: this.breakUsual.from.minutes,
        date: currentDate.format("MM/DD/YYYY")
      };
      const to: EventHoursInput = {
        hours: this.breakUsual.to.hours,
        minutes: this.breakUsual.to.minutes,
        date: currentDate.format("MM/DD/YYYY")
      };

      let breakEvent: CalendarEvent | null = CalendarService.constructEvent(
        "Pauza",
        from,
        to
      );

      if (currentDate.date() % 2) {
        workingHours = this.workingHoursAlternative;
        from.hours = this.breakAlternative.from.hours;
        from.minutes = this.breakAlternative.from.minutes;
        to.hours = this.breakAlternative.to.hours;
        to.minutes = this.breakAlternative.to.minutes;
        breakEvent = CalendarService.constructEvent("Pauza", from, to);
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

  public static constructEvent(
    title: string,
    from: EventHoursInput,
    to: EventHoursInput
  ): CalendarEvent {
    const momentObjectFrom = moment(
      `${from.date} ${from.hours}:${from.minutes}`
    );
    const momentObjectTo = moment(`${to.date} ${to.hours}:${to.minutes}`);
    return {
      title,
      time: {
        from: {
          hours: from.hours,
          minutes: from.minutes
        },
        to: {
          hours: to.hours,
          minutes: to.minutes
        }
      },
      momentObjectFrom,
      momentObjectTo
    };
  }

  public static generateRandomDate(start: Moment, end: Moment) {
    const unixTimestamp =
      start.unix() + Math.random() * (end.unix() - start.unix());
    const roundedTimestamp = unixTimestamp - (unixTimestamp % 1800);
    return moment(roundedTimestamp * 1000);
  }

  public static validateEvent(event: CalendarEvent, calendarDay: CalendarDay) {
    if (calendarDay.workingHours === null) {
      return false;
    }
    const workingHoursStart = calendarDay.momentObject
      .clone()
      .hour(calendarDay.workingHours.from.hours)
      .minute(calendarDay.workingHours.from.minutes);
    const workingHoursEnd = calendarDay.momentObject
      .clone()
      .hour(calendarDay.workingHours.to.hours)
      .minute(calendarDay.workingHours.to.minutes);
    return (
      event.momentObjectFrom.valueOf() >= workingHoursStart.valueOf() &&
      event.momentObjectTo.valueOf() <= workingHoursEnd.valueOf()
    );
  }

  public static validateOverlapping(
    generatedEvent: CalendarEvent,
    events: CalendarEvent[],
    currentDay: CalendarDay
  ) {
    let isOverlapping = false;
    if (currentDay.breakEvent) {
      events.slice().push(currentDay.breakEvent);
    }
    events.forEach((event: CalendarEvent) => {
      const eventStart = event.momentObjectFrom;
      const eventEnd = event.momentObjectTo;
      if (
        Math.max(
          eventStart.valueOf(),
          generatedEvent.momentObjectFrom.valueOf()
        ) <
          Math.min(
            eventEnd.valueOf(),
            generatedEvent.momentObjectTo.valueOf()
          ) ||
        eventStart.isSame(generatedEvent.momentObjectFrom)
      ) {
        isOverlapping = true;
      }
    });
    return isOverlapping;
  }
}
