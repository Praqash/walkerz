const hotelTimeZone = "Asia/Kolkata";

export const getTodayDateValue = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: hotelTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
};

export const isPastDate = (date: string) =>
  Boolean(date && date < getTodayDateValue());

export const addDays = (date: string, days: number) => {
  const nextDate = new Date(`${date}T12:00:00`);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
};

export const getDateRange = (startDate: string, days: number) =>
  Array.from({ length: days }, (_, index) => addDays(startDate, index));

export const getBookedNightDates = (checkIn: string, checkOut: string) => {
  const dates: string[] = [];
  let currentDate = checkIn;

  while (currentDate && currentDate < checkOut) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};
