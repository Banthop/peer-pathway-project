import { useState } from "react";
import { CalendarClock, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface RescheduleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    personName: string;
}

export function RescheduleModal({ open, onOpenChange, personName }: RescheduleModalProps) {
    const [reason, setReason] = useState("");
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setReason("");
            onOpenChange(false);
        }, 2500);
    };

    const handleOpenChange = (value: boolean) => {
        if (!value) {
            setSent(false);
            setReason("");
        }
        onOpenChange(value);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                {sent ? (
                    <div className="py-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-4">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-2">Reschedule request sent</h3>
                        <p className="text-sm text-muted-foreground">
                            {personName} will get back to you within 24 hours.
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CalendarClock className="w-4 h-4" />
                                Request to reschedule
                            </DialogTitle>
                            <DialogDescription>
                                Let {personName} know you'd like to change the time.
                            </DialogDescription>
                        </DialogHeader>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for rescheduling (optional)"
                            className="w-full h-24 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:ring-1 focus:ring-foreground/20 transition-shadow"
                        />
                        <button
                            onClick={handleSend}
                            className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors cursor-pointer"
                        >
                            Send request
                        </button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
