import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Coach } from "@/types/coach";

interface CoachServicesProps {
  coach: Coach;
}

const CoachServices = ({ coach }: CoachServicesProps) => {
  return (
    <section className="py-8 border-t border-border">
      <h2 className="text-xl font-sans font-medium text-foreground mb-6">
        Coaching Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {coach.services.map((service, index) => (
          <Card key={index} className="border-border/60">
            <CardContent className="p-5">
              <h3 className="text-base font-sans font-medium text-foreground mb-1">
                {service.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground font-sans font-light mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{service.duration}</span>
              </div>
              <p className="text-sm text-muted-foreground font-sans font-light mb-4">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-base font-sans font-medium text-foreground">
                  £{service.price}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="font-sans font-light text-xs"
                >
                  Book now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Hourly */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
        <div>
          <span className="text-sm font-sans font-medium text-foreground">
            Custom Hourly
          </span>
          <span className="text-sm text-muted-foreground font-sans font-light ml-2">
            · £{coach.hourlyRate}/hr
          </span>
          <p className="text-sm text-muted-foreground font-sans font-light mt-1">
            Get help with specific questions or topics
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="font-sans font-light text-xs"
        >
          Buy coaching
        </Button>
      </div>
    </section>
  );
};

export default CoachServices;
