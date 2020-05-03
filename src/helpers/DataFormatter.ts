const offsetFromTop = 420;

export function formatHoursAndMinutes(hours: number, minutes: number) {
  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
}

export function convertTimeToHeightPixels(hours: number, minutes: number) {
  return hours * 60 + minutes;
}
export function convertTimeToTopPixels(hours: number, minutes: number) {
  return hours * 60 + minutes - offsetFromTop;
}
