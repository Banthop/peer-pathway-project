import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoSessionPrompt() {
  return (
    <div className="rounded-lg border border-border bg-background p-6">
      <p className="text-foreground font-medium">You don't have any sessions coming up</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse our coaches and book your next session.
      </p>
      <Button
        asChild
        className="mt-4 bg-foreground text-background hover:bg-foreground/90 font-sans"
      >
        <Link to="/" className="flex items-center gap-2">
          Browse coaches <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
