import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { generateTimeSlots, type TimeSlot } from "@/types/booking";

interface DateTimePickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimePicker = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimePickerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  // Disable past dates
  const disabledDays = { before: new Date() };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar */}
      <div className="flex-shrink-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          disabled={disabledDays}
          className="rounded-md border border-border pointer-events-auto"
          initialFocus
        />
      </div>

      {/* Time Slots */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-sans font-medium text-foreground mb-3">
          Available times
        </h4>
        {selectedDate ? (
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && onTimeChange(slot.time)}
                disabled={!slot.available}
                className={cn(
                  "py-2 px-3 rounded-md border text-sm font-sans font-light transition-colors",
                  slot.available
                    ? selectedTime === slot.time
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground/50 text-foreground"
                    : "border-border/50 text-muted-foreground/50 cursor-not-allowed line-through"
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground font-sans font-light">
            Select a date to see available times
          </p>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
