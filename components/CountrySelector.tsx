"use client";

import { useState, useEffect } from "react";
import { countries, Country } from "@/lib/config/countries";

interface CountrySelectorProps {
  onSelect?: (country: Country) => void;
  defaultCountry?: string;
}

export default function CountrySelector({ onSelect, defaultCountry = "SN" }: CountrySelectorProps) {
  const [selected, setSelected] = useState<Country | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const country = countries.find(c => c.code === defaultCountry);
    if (country) {
      setSelected(country);
      if (onSelect) onSelect(country);
    }
  }, [defaultCountry]);

  const handleSelect = (country: Country) => {
    setSelected(country);
    setIsOpen(false);
    if (onSelect) onSelect(country);
    // Sauvegarder dans localStorage
    localStorage.setItem("sunushop_country", country.code);
  };

  const activeCountries = countries.filter(c => c.active);

  if (!selected) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      >
        <span className="text-xl">{selected.flag}</span>
        <span className="font-medium text-sm">{selected.code}</span>
        <span className="text-xs text-gray-500">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 font-medium">Choisissez votre pays</p>
          </div>
          {activeCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleSelect(country)}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-left ${
                selected.code === country.code ? "bg-green-50 dark:bg-green-900/20" : ""
              }`}
            >
              <span className="text-xl">{country.flag}</span>
              <div>
                <p className="font-medium text-sm">{country.name}</p>
                <p className="text-xs text-gray-500">{country.currencySymbol} • {country.phoneCode}</p>
              </div>
              {selected.code === country.code && (
                <span className="ml-auto text-green-600">✅</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
