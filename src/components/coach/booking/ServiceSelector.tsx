import { cn } from "@/lib/utils";
import type { CoachService } from "@/types/coach";
import type { SelectedService } from "@/types/booking";

interface ServiceSelectorProps {
  services: CoachService[];
  hourlyRate: number;
  selectedService?: SelectedService;
  onSelect: (service: SelectedService) => void;
}

const ServiceSelector = ({
  services,
  hourlyRate,
  selectedService,
  onSelect,
}: ServiceSelectorProps) => {
  const customHourlyService: SelectedService = {
    name: "Custom Hourly",
    duration: "60 min",
    price: hourlyRate,
    description: "Flexible time for specific questions or topics",
  };

  const allServices: SelectedService[] = [
    ...services.map((s) => ({
      name: s.name,
      duration: s.duration,
      price: s.price,
      description: s.description,
    })),
    customHourlyService,
  ];

  return (
    <div className="space-y-3">
      {allServices.map((service) => {
        const isSelected = selectedService?.name === service.name;
        return (
          <button
            key={service.name}
            onClick={() => onSelect(service)}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-colors",
              isSelected
                ? "border-foreground bg-foreground/5"
                : "border-border hover:border-foreground/50"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Radio indicator */}
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors",
                  isSelected
                    ? "border-foreground bg-foreground"
                    : "border-muted-foreground"
                )}
              >
                {isSelected && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </div>
                )}
              </div>

              {/* Service details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-sans font-medium text-foreground">
                    {service.name}
                  </h4>
                  <span className="text-sm font-sans font-light text-foreground">
                    £{service.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-sans font-light mt-0.5">
                  {service.duration}
                </p>
                {service.description && (
                  <p className="text-sm text-muted-foreground font-sans font-light mt-1">
                    {service.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ServiceSelector;
