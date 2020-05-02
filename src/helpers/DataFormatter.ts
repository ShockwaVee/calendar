export function formatHoursAndMinutes(hours: number, minutes: number) {
  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
}
