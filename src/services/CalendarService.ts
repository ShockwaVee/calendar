import moment, { Moment } from "moment";
import { CalendarDay } from "@/interfaces/CalendarDay";
import { EventHours } from "@/interfaces/EventHours";
import { CalendarEvent } from "@/interfaces/CalendarEvent";
import { EventHoursInput } from "@/interfaces/EventHoursInput";
import { EventConstructor } from "@/interfaces/EventConstructor";

export class CalendarService {
  private readonly startingDate: Moment | null;
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

  constructor(startingDate?: Date) {
    if (startingDate == null) {
      this.startingDate = null;
      return;
    }
    this.startingDate = moment(startingDate);
  }

  public generateNDays(numberOfDays: number): CalendarDay[] {
    if (this.startingDate == null) {
      console.error("Starting date is not set");
      return [];
    }
    const calendarDays: CalendarDay[] = [];
    let currentDate = this.startingDate.clone();

    for (let i = 0; i < numberOfDays; i++) {
      calendarDays.push(this.generateDay(currentDate));
      currentDate = currentDate.clone().add(1, "d");
    }
    return calendarDays;
  }

  public generateDay(currentDate: Moment) {
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

    let breakEvent: CalendarEvent | null = CalendarService.constructEvent({
      title: "Pauza",
      from,
      to,
      isBreak: true
    });

    if (currentDate.date() % 2) {
      workingHours = this.workingHoursAlternative;
      from.hours = this.breakAlternative.from.hours;
      from.minutes = this.breakAlternative.from.minutes;
      to.hours = this.breakAlternative.to.hours;
      to.minutes = this.breakAlternative.to.minutes;
      breakEvent = CalendarService.constructEvent({
        title: "Pauza",
        from,
        to,
        isBreak: true
      });
    }
    if (
      currentDate.weekday() === 6 ||
      (currentDate.weekday() === 5 && currentDate.date() % 2 !== 0)
    ) {
      workingHours = null;
      breakEvent = null;
    }

    return {
      momentObject: currentDate,
      workingHours,
      breakEvent
    };
  }

  public static constructEvent({
    title,
    from,
    to,
    isUserGenerated = false,
    isBreak = false
  }: EventConstructor): CalendarEvent {
    const momentObjectFrom = moment(
      `${from.date} ${from.hours}:${from.minutes}`
    );
    let momentObjectTo;
    if (to == null) {
      momentObjectTo = momentObjectFrom.clone().add(30, "m");
    } else {
      momentObjectTo = moment(`${to.date} ${to.hours}:${to.minutes}`);
    }
    return {
      title,
      time: {
        from: {
          hours: from.hours,
          minutes: from.minutes
        },
        to: {
          hours: momentObjectTo.hour(),
          minutes: momentObjectTo.minute()
        }
      },
      momentObjectFrom,
      momentObjectTo,
      isUserGenerated,
      isBreak
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
      .minute(calendarDay.workingHours.from.minutes)
      .second(0);
    const workingHoursEnd = calendarDay.momentObject
      .clone()
      .hour(calendarDay.workingHours.to.hours)
      .minute(calendarDay.workingHours.to.minutes)
      .second(0);

    return (
      event.momentObjectFrom.valueOf() >=
        workingHoursStart.valueOf() - (workingHoursStart.valueOf() % 1800) &&
      event.momentObjectTo.valueOf() <=
        workingHoursEnd.valueOf() - (workingHoursEnd.valueOf() % 1800)
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
  public static validateMaximumNumberOfEvents(
    event: CalendarEvent,
    events: CalendarEvent[]
  ) {
    const numberOfUserGeneratedEvents = events.filter(calendarEvent => {
      return calendarEvent.isUserGenerated;
    });

    if (numberOfUserGeneratedEvents.length >= 2) {
      return "Ne možete zakazati više od dva termina tjedno";
    }
    for (const calendarEvent of events) {
      if (
        calendarEvent.momentObjectFrom.isSame(event.momentObjectFrom, "day") &&
        calendarEvent.isUserGenerated
      ) {
        return "Ne možete zakazati više od jednog termina dnevno!";
      }
    }
    return true;
  }
}
