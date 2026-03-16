export interface CountryCode {
    code: string;    // e.g. "+44"
    iso: string;     // ISO 3166-1 alpha-2 lowercase, e.g. "gb"
    name: string;    // e.g. "United Kingdom"
}

/** Returns a flagcdn.com URL for the country's flag */
export function getFlagUrl(iso: string, size = 24): string {
    return `https://flagcdn.com/${size}x${Math.round(size * 0.75)}/${iso}.png`;
}

export const COUNTRY_CODES: CountryCode[] = [
    { code: "+44", iso: "gb", name: "United Kingdom" },
    { code: "+1", iso: "us", name: "United States" },
    { code: "+1", iso: "ca", name: "Canada" },
    { code: "+353", iso: "ie", name: "Ireland" },
    { code: "+33", iso: "fr", name: "France" },
    { code: "+49", iso: "de", name: "Germany" },
    { code: "+34", iso: "es", name: "Spain" },
    { code: "+39", iso: "it", name: "Italy" },
    { code: "+31", iso: "nl", name: "Netherlands" },
    { code: "+32", iso: "be", name: "Belgium" },
    { code: "+41", iso: "ch", name: "Switzerland" },
    { code: "+43", iso: "at", name: "Austria" },
    { code: "+46", iso: "se", name: "Sweden" },
    { code: "+47", iso: "no", name: "Norway" },
    { code: "+45", iso: "dk", name: "Denmark" },
    { code: "+358", iso: "fi", name: "Finland" },
    { code: "+48", iso: "pl", name: "Poland" },
    { code: "+351", iso: "pt", name: "Portugal" },
    { code: "+30", iso: "gr", name: "Greece" },
    { code: "+420", iso: "cz", name: "Czech Republic" },
    { code: "+36", iso: "hu", name: "Hungary" },
    { code: "+40", iso: "ro", name: "Romania" },
    { code: "+359", iso: "bg", name: "Bulgaria" },
    { code: "+385", iso: "hr", name: "Croatia" },
    { code: "+61", iso: "au", name: "Australia" },
    { code: "+64", iso: "nz", name: "New Zealand" },
    { code: "+91", iso: "in", name: "India" },
    { code: "+86", iso: "cn", name: "China" },
    { code: "+81", iso: "jp", name: "Japan" },
    { code: "+82", iso: "kr", name: "South Korea" },
    { code: "+65", iso: "sg", name: "Singapore" },
    { code: "+852", iso: "hk", name: "Hong Kong" },
    { code: "+60", iso: "my", name: "Malaysia" },
    { code: "+66", iso: "th", name: "Thailand" },
    { code: "+63", iso: "ph", name: "Philippines" },
    { code: "+84", iso: "vn", name: "Vietnam" },
    { code: "+62", iso: "id", name: "Indonesia" },
    { code: "+971", iso: "ae", name: "United Arab Emirates" },
    { code: "+966", iso: "sa", name: "Saudi Arabia" },
    { code: "+974", iso: "qa", name: "Qatar" },
    { code: "+972", iso: "il", name: "Israel" },
    { code: "+90", iso: "tr", name: "Turkey" },
    { code: "+27", iso: "za", name: "South Africa" },
    { code: "+234", iso: "ng", name: "Nigeria" },
    { code: "+254", iso: "ke", name: "Kenya" },
    { code: "+233", iso: "gh", name: "Ghana" },
    { code: "+20", iso: "eg", name: "Egypt" },
    { code: "+55", iso: "br", name: "Brazil" },
    { code: "+52", iso: "mx", name: "Mexico" },
    { code: "+54", iso: "ar", name: "Argentina" },
    { code: "+57", iso: "co", name: "Colombia" },
    { code: "+56", iso: "cl", name: "Chile" },
    { code: "+7", iso: "ru", name: "Russia" },
    { code: "+380", iso: "ua", name: "Ukraine" },
    { code: "+94", iso: "lk", name: "Sri Lanka" },
    { code: "+92", iso: "pk", name: "Pakistan" },
    { code: "+880", iso: "bd", name: "Bangladesh" },
];

export const DEFAULT_COUNTRY_CODE = COUNTRY_CODES[0]; // UK
