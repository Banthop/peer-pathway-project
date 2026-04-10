import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { YEAR_OPTIONS } from "@/data/webinarData";
import { useUniversitySearch } from "@/hooks/useUniversitySearch";
import { cn } from "@/lib/utils";
import { ArrowRight, Search } from "lucide-react";

interface UniversityStepProps {
  university: string;
  yearOfStudy: string;
  onUpdate: (field: "university" | "yearOfStudy", value: string) => void;
  onContinue: () => string | null;
}

export function UniversityStep({
  university,
  yearOfStudy,
  onUpdate,
  onContinue,
}: UniversityStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { universities, loading } = useUniversitySearch(university);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  const handleSelect = (name: string) => {
    onUpdate("university", name);
    setShowDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* University */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-gray-900">
          Where do you study?
        </h2>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for your university..."
              value={university}
              onChange={(e) => {
                onUpdate("university", e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="font-sans text-base h-12 border-gray-200 pl-10 rounded-xl text-gray-900"
              autoComplete="off"
            />
          </div>

          {showDropdown && universities.length > 0 && !(universities.length === 1 && universities[0] === university) && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-[240px] overflow-y-auto"
            >
              {universities.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelect(name)}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-sans font-light transition-colors text-gray-900",
                    "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    name === university && "bg-gray-50",
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {loading && university.length >= 2 && showDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
              <p className="text-sm text-gray-500 font-sans font-light">
                Loading universities...
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 font-sans font-light">
          Can't find yours? Just type it in manually
        </p>
      </div>

      {/* Year of study */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-gray-900">
          What year are you in?
        </h2>
        <div className="flex flex-wrap gap-2">
          {YEAR_OPTIONS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => onUpdate("yearOfStudy", year)}
              className={cn(
                "px-5 py-2.5 text-sm rounded-full border font-sans font-light transition-all duration-200",
                yearOfStudy === year
                  ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                  : "bg-white text-gray-900 border-gray-300 hover:border-gray-500",
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Continue */}
      <Button
        type="submit"
        className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-8 py-3 text-sm rounded-xl w-full sm:w-auto"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
