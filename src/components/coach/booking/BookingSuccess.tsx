import { format } from "date-fns";
import { Check, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateGoogleCalendarUrl,
  generateAppleCalendarUrl,
} from "@/types/booking";

interface BookingSuccessProps {
  coachName: string;
  date: Date;
  time: string;
  email: string;
  serviceName: string;
  duration: number;
  isPaid: boolean;
  price?: number;
  onDone: () => void;
}

const BookingSuccess = ({
  coachName,
  date,
  time,
  email,
  serviceName,
  duration,
  isPaid,
  price,
  onDone,
}: BookingSuccessProps) => {
  const formattedDate = format(date, "EEEE, MMMM d, yyyy");
  const googleCalUrl = generateGoogleCalendarUrl(
    coachName,
    date,
    time,
    duration,
    serviceName
  );
  const appleCalUrl = generateAppleCalendarUrl(
    coachName,
    date,
    time,
    duration,
    serviceName
  );

  return (
    <div className="text-center py-4">
      {/* Success checkmark */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      <h3 className="text-xl font-sans font-medium text-foreground mb-2">
        You're all set!
      </h3>

      <p className="text-sm text-muted-foreground font-sans font-light mb-4">
        Your {isPaid ? serviceName.toLowerCase() : "free intro"} with{" "}
        {coachName.split(" ")[0]} is booked for:
      </p>

      <p className="text-foreground font-sans font-medium mb-1">
        {formattedDate}
      </p>
      <p className="text-foreground font-sans font-light mb-1">
        at {time} GMT
      </p>
      {isPaid && price && (
        <p className="text-sm text-muted-foreground font-sans font-light mb-4">
          Total paid: £{price}
        </p>
      )}

      <p className="text-sm text-muted-foreground font-sans font-light mb-6">
        A confirmation email has been sent to
        <br />
        <span className="text-foreground">{email}</span>
      </p>

      {/* Calendar buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
        <Button
          variant="outline"
          className="font-sans font-light"
          onClick={() => window.open(googleCalUrl, "_blank")}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Add to Google Calendar
        </Button>
        <Button
          variant="outline"
          className="font-sans font-light"
          asChild
        >
          <a href={appleCalUrl} download="coaching-session.ics">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Add to Apple Calendar
          </a>
        </Button>
      </div>

      <Button
        onClick={onDone}
        className="font-sans font-light bg-foreground text-background hover:bg-foreground/90"
      >
        Done
      </Button>
    </div>
  );
};

export default BookingSuccess;
