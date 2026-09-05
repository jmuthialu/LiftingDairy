import { format } from "date-fns";

export const DISPLAY_DATE_FORMAT = "do MMM yyyy";
export const DATE_KEY_FORMAT = "yyyy-MM-dd";

export function formatDisplayDate(date: Date): string {
  return format(date, DISPLAY_DATE_FORMAT);
}

export function toDateKey(date: Date): string {
  return format(date, DATE_KEY_FORMAT);
}
