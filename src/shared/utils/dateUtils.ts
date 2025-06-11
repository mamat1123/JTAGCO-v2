import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

/**
 * Format a date string to Thai locale with timezone adjustment
 * @param dateString - ISO date string to format
 * @param formatString - Optional format string (default: "d MMM yyyy HH:mm")
 * @returns Formatted date string in Thai locale
 */
export const formatThaiDate = (
  dateString: string,
  formatString: string = "d MMM yyyy HH:mm"
): string => {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    // Add 7 hours for Thailand timezone
    const thaiDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return format(thaiDate, formatString, { locale: th });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Format a date string to Thai locale with date only
 * @param dateString - ISO date string to format
 * @returns Formatted date string in Thai locale (e.g., "1 ม.ค. 2567")
 */
export const formatThaiDateOnly = (dateString: string): string => {
  return formatThaiDate(dateString, "d MMM yyyy");
};

/**
 * Format a date string to Thai locale with time only
 * @param dateString - ISO date string to format
 * @returns Formatted time string in Thai locale (e.g., "14:30")
 */
export const formatThaiTimeOnly = (dateString: string): string => {
  return formatThaiDate(dateString, "HH:mm");
}; 