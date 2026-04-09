import { useState, useRef, useEffect, useMemo } from "react";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE, getFlagUrl } from "@/data/countryCodeData";
import type { CountryCode } from "@/data/countryCodeData";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface PhoneInputProps {
    phoneCode: string;
    phone: string;
    onCodeChange: (code: string) => void;
    onPhoneChange: (phone: string) => void;
}

function FlagImg({ iso, size = 20 }: { iso: string; size?: number }) {
    return (
        <img
            src={getFlagUrl(iso, size)}
            alt=""
            width={size}
            height={Math.round(size * 0.75)}
            className="inline-block rounded-[2px] object-cover"
            loading="lazy"
        />
    );
}

export function PhoneInput({
    phoneCode,
    phone,
    onCodeChange,
    onPhoneChange,
}: PhoneInputProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Parse selected from the stored code string
    const selected =
        COUNTRY_CODES.find((c) => `${c.iso}:${c.code}` === phoneCode) ??
        DEFAULT_COUNTRY_CODE;

    // Close on click outside
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Focus search when dropdown opens
    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 50);
        }
    }, [open]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return COUNTRY_CODES;
        return COUNTRY_CODES.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.code.includes(q) ||
                c.iso.includes(q),
        );
    }, [search]);

    const handleSelect = (c: CountryCode) => {
        onCodeChange(`${c.iso}:${c.code}`);
        setOpen(false);
        setSearch("");
    };

    return (
        <div className="flex gap-2">
            {/* Country code selector */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={cn(
                        "flex items-center gap-2 h-12 px-3 rounded-xl border border-border bg-transparent",
                        "text-sm font-sans transition-colors hover:border-white/20 whitespace-nowrap",
                        "min-w-[120px]",
                    )}
                >
                    <FlagImg iso={selected.iso} />
                    <span className="text-white">{selected.code}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-white/50 ml-auto" />
                </button>

                {open && (
                    <div className="absolute z-50 top-full mt-1 left-0 w-72 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-white/10">
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search country..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full text-white text-sm font-sans px-3 py-2 rounded-lg border border-white/10 bg-transparent outline-none focus:border-white/30"
                            />
                        </div>

                        {/* List */}
                        <div className="max-h-52 overflow-y-auto custom-scrollbar">
                            {filtered.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-white/50 font-sans">
                                    No results
                                </p>
                            ) : (
                                filtered.map((c, i) => (
                                    <button
                                        key={`${c.iso}-${c.code}-${i}`}
                                        type="button"
                                        onClick={() => handleSelect(c)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans transition-colors",
                                            "hover:bg-white/10 focus:bg-white/10 focus:outline-none",
                                            selected.iso === c.iso && selected.code === c.code
                                                ? "bg-white/10"
                                                : "",
                                        )}
                                    >
                                        <FlagImg iso={c.iso} />
                                        <span className="text-white flex-1 text-left">
                                            {c.name}
                                        </span>
                                        <span className="text-white/50 text-xs">{c.code}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Phone number input */}
            <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                className="flex-1 h-12 px-4 rounded-xl border border-border bg-transparent text-white text-base font-sans outline-none focus:border-white/40 transition-colors"
                autoComplete="tel-national"
            />
        </div>
    );
}
