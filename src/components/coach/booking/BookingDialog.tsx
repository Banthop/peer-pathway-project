import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import DateTimePicker from "./DateTimePicker";
import ServiceSelector from "./ServiceSelector";
import BookingDetailsForm from "./BookingDetailsForm";
import BookingSuccess from "./BookingSuccess";
import type { Coach } from "@/types/coach";
import type { BookingType, SelectedService, BookingFormData } from "@/types/booking";

interface BookingDialogProps {
  coach: Coach;
  type: BookingType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialService?: SelectedService;
  initialDate?: Date;
  initialTime?: string;
}

const BookingDialog = ({
  coach,
  type,
  open,
  onOpenChange,
  initialService,
  initialDate,
  initialTime,
}: BookingDialogProps) => {
  const isMobile = useIsMobile();
  const firstName = coach.name.split(" ")[0];

  // Booking state
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<SelectedService | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [formData, setFormData] = useState<BookingFormData | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFreeIntro = type === "free-intro";
  const totalSteps = isFreeIntro ? 3 : 4;

  // Free intro service details
  const freeIntroService: SelectedService = {
    name: "Free Intro",
    duration: "15 min",
    price: 0,
    description: "A quick call to see if we're a good fit",
  };

  const currentService = isFreeIntro ? freeIntroService : selectedService;
  const serviceDuration = parseInt(currentService?.duration || "15");

  const resetState = () => {
    setStep(1);
    setSelectedService(undefined);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setFormData(undefined);
    setIsSubmitting(false);
  };

  // Apply initial values when dialog opens
  useEffect(() => {
    if (open) {
      if (initialService && type === "session") {
        setSelectedService(initialService);
        setStep(2); // skip service selection, go straight to date/time
      }
      if (initialDate) setSelectedDate(initialDate);
      if (initialTime) setSelectedTime(initialTime);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(resetState, 300);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    setStep(step + 1);
  };

  const handleFormSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setFormData(data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setStep(step + 1);
  };

  const canContinue = () => {
    if (isFreeIntro) {
      if (step === 1) return selectedDate && selectedTime;
    } else {
      if (step === 1) return !!selectedService;
      if (step === 2) return selectedDate && selectedTime;
    }
    return true;
  };

  const renderStepContent = () => {
    if (isFreeIntro) {
      // Free Intro Flow: DateTime -> Details -> Success
      switch (step) {
        case 1:
          return (
            <>
              <DialogHeader className="space-y-1.5">
                <DialogTitle className="font-sans font-medium text-lg">
                  Schedule a free intro with {firstName}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-sans font-light">
                  A 15-minute call to see if we're a good fit
                </p>
              </DialogHeader>
              <div className="mt-4">
                <DateTimePicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateChange={setSelectedDate}
                  onTimeChange={setSelectedTime}
                />
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue()}
                  className="font-sans font-light bg-foreground text-background hover:bg-foreground/90"
                >
                  Continue →
                </Button>
              </div>
            </>
          );
        case 2:
          return (
            <>
              <DialogHeader className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <DialogTitle className="font-sans font-medium text-lg">
                    Almost there!
                  </DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground font-sans font-light pl-7">
                  Confirm your details for{" "}
                  {selectedDate && format(selectedDate, "EEEE, MMM d")} at{" "}
                  {selectedTime}
                </p>
              </DialogHeader>
              <div className="mt-4">
                <BookingDetailsForm
                  isPaid={false}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </>
          );
        case 3:
          return (
            <BookingSuccess
              coachName={coach.name}
              date={selectedDate!}
              time={selectedTime!}
              email={formData?.email || ""}
              serviceName="Free Intro"
              duration={15}
              isPaid={false}
              onDone={handleClose}
            />
          );
      }
    } else {
      // Book Session Flow: Service -> DateTime -> Details -> Success
      switch (step) {
        case 1:
          return (
            <>
              <DialogHeader className="space-y-1.5">
                <DialogTitle className="font-sans font-medium text-lg">
                  Book a session with {firstName}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-sans font-light">
                  Choose the type of coaching you need
                </p>
              </DialogHeader>
              <div className="mt-4">
                <ServiceSelector
                  services={coach.services}
                  hourlyRate={coach.hourlyRate}
                  selectedService={selectedService}
                  onSelect={setSelectedService}
                />
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue()}
                  className="font-sans font-light bg-foreground text-background hover:bg-foreground/90"
                >
                  Continue →
                </Button>
              </div>
            </>
          );
        case 2:
          return (
            <>
              <DialogHeader className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <DialogTitle className="font-sans font-medium text-lg">
                    Select date & time
                  </DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground font-sans font-light pl-7">
                  {selectedService?.name} · {selectedService?.duration} · £
                  {selectedService?.price}
                </p>
              </DialogHeader>
              <div className="mt-4">
                <DateTimePicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateChange={setSelectedDate}
                  onTimeChange={setSelectedTime}
                />
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue()}
                  className="font-sans font-light bg-foreground text-background hover:bg-foreground/90"
                >
                  Continue →
                </Button>
              </div>
            </>
          );
        case 3:
          return (
            <>
              <DialogHeader className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <DialogTitle className="font-sans font-medium text-lg">
                    Booking: {selectedService?.name}
                  </DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground font-sans font-light pl-7">
                  {selectedDate && format(selectedDate, "EEEE, MMM d")} at{" "}
                  {selectedTime} · £{selectedService?.price}
                </p>
              </DialogHeader>
              <div className="mt-4">
                <BookingDetailsForm
                  isPaid={true}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  submitLabel={`Confirm & Pay · £${selectedService?.price}`}
                />
              </div>
            </>
          );
        case 4:
          return (
            <BookingSuccess
              coachName={coach.name}
              date={selectedDate!}
              time={selectedTime!}
              email={formData?.email || ""}
              serviceName={selectedService?.name || "Coaching Session"}
              duration={serviceDuration}
              isPaid={true}
              price={selectedService?.price}
              onDone={handleClose}
            />
          );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={
          isMobile
            ? "w-full h-full max-w-full max-h-full rounded-none border-0"
            : "max-w-xl"
        }
      >
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
