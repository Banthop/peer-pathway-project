import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { BookingFormData } from "@/types/booking";

const freeIntroSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(255, "Email must be less than 255 characters"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

const paidSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(255, "Email must be less than 255 characters"),
  focusTopic: z
    .string()
    .trim()
    .min(10, "Please describe what you'd like to focus on (at least 10 characters)")
    .max(1000, "Focus topic must be less than 1000 characters"),
});

type FreeIntroFormData = z.infer<typeof freeIntroSchema>;
type PaidFormData = z.infer<typeof paidSchema>;

interface BookingDetailsFormProps {
  isPaid: boolean;
  onSubmit: (data: BookingFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const BookingDetailsForm = ({
  isPaid,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Confirm Booking",
}: BookingDetailsFormProps) => {
  if (isPaid) {
    return (
      <PaidBookingForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
      />
    );
  }

  return (
    <FreeIntroForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
    />
  );
};

interface FormProps {
  onSubmit: (data: BookingFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const FreeIntroForm = ({ onSubmit, isSubmitting, submitLabel }: FormProps) => {
  const form = useForm<FreeIntroFormData>({
    resolver: zodResolver(freeIntroSchema),
    defaultValues: {
      fullName: "",
      email: "",
      notes: "",
    },
  });

  const handleSubmit = (data: FreeIntroFormData) => {
    onSubmit(data as BookingFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans font-light">Full Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Smith"
                  className="font-sans font-light"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-sans font-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans font-light">Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="font-sans font-light"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-sans font-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans font-light">
                Anything you'd like them to know? (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I'm applying for spring week programmes and would like guidance on..."
                  className="font-sans font-light min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-sans font-light" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-sans font-light bg-foreground text-background hover:bg-foreground/90"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
};

const PaidBookingForm = ({ onSubmit, isSubmitting, submitLabel }: FormProps) => {
  const form = useForm<PaidFormData>({
    resolver: zodResolver(paidSchema),
    defaultValues: {
      fullName: "",
      email: "",
      focusTopic: "",
    },
  });

  const handleSubmit = (data: PaidFormData) => {
    onSubmit(data as BookingFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans font-light">Full Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Smith"
                  className="font-sans font-light"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-sans font-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans font-light">Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="font-sans font-light"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-sans font-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="focusTopic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans font-light">
                What would you like to focus on? *
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I have a Goldman Sachs superday coming up and want to practice market sizing questions..."
                  className="font-sans font-light min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-sans font-light" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-sans font-light bg-foreground text-background hover:bg-foreground/90"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
};

export default BookingDetailsForm;
