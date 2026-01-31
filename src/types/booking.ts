import type { CoachService } from "./coach";

export type BookingType = "free-intro" | "session";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  notes?: string;
  focusTopic?: string;
}

export interface SelectedService {
  name: string;
  duration: string;
  price: number;
  description?: string;
}

export interface BookingState {
  type: BookingType;
  step: number;
  selectedService?: SelectedService;
  selectedDate?: Date;
  selectedTime?: string;
  formData?: BookingFormData;
}

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  // Mock availability - in production this would come from an API
  const dayOfWeek = date.getDay();
  
  // Different availability patterns for different days
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend - limited slots
    return [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "2:00 PM", available: false },
      { time: "3:00 PM", available: true },
    ];
  }
  
  // Weekday - more slots
  return [
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "2:00 PM", available: true },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: false },
    { time: "5:00 PM", available: true },
    { time: "6:00 PM", available: true },
    { time: "7:00 PM", available: true },
  ];
};

export const generateGoogleCalendarUrl = (
  coachName: string,
  date: Date,
  time: string,
  duration: number,
  serviceName: string
): string => {
  // Parse time string to get hours and minutes
  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  let hour24 = hours;
  if (period === "PM" && hours !== 12) hour24 += 12;
  if (period === "AM" && hours === 12) hour24 = 0;

  const startDate = new Date(date);
  startDate.setHours(hour24, minutes, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + duration);

  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const title = encodeURIComponent(`Coaching with ${coachName}`);
  const details = encodeURIComponent(serviceName);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
};

export const generateAppleCalendarUrl = (
  coachName: string,
  date: Date,
  time: string,
  duration: number,
  serviceName: string
): string => {
  // For Apple Calendar, we create an .ics file content as a data URL
  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  let hour24 = hours;
  if (period === "PM" && hours !== 12) hour24 += 12;
  if (period === "AM" && hours === 12) hour24 = 0;

  const startDate = new Date(date);
  startDate.setHours(hour24, minutes, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + duration);

  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Coaching with ${coachName}
DESCRIPTION:${serviceName}
END:VEVENT
END:VCALENDAR`;

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
};
