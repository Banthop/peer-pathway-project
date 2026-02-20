import { useState } from "react";
import { MessageSquare, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface MessageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coachName: string;
}

export function MessageModal({ open, onOpenChange, coachName }: MessageModalProps) {
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setMessage("");
            onOpenChange(false);
        }, 2500);
    };

    const handleOpenChange = (value: boolean) => {
        if (!value) {
            setSent(false);
            setMessage("");
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
                        <h3 className="text-base font-semibold text-foreground mb-2">Message sent!</h3>
                        <p className="text-sm text-muted-foreground">
                            {coachName} typically responds within 24 hours.
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Message {coachName}
                            </DialogTitle>
                            <DialogDescription>
                                Ask a question before booking, or introduce yourself.
                            </DialogDescription>
                        </DialogHeader>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`Hi ${coachName.split(" ")[0]}, I'd like to ask about...`}
                            className="w-full h-32 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:ring-1 focus:ring-foreground/20 transition-shadow"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${message.trim()
                                    ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                                }`}
                        >
                            Send message
                        </button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
