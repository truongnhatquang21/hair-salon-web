"use client";

import { useState } from "react";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";

type SearchCourtAddressProps = {
  onValueChange?: (value: Option | null) => void;
};
const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
  {
    value: "express.js",
    label: "Express.js",
  },
  {
    value: "nest.js",
    label: "Nest.js",
  },
];

export function SearchCourtAddress({ onValueChange }: SearchCourtAddressProps) {
  const [value, setValue] = useState<Option>();

  const handleChange = (newValue: Option) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <AutoComplete
      options={FRAMEWORKS}
      emptyMessage="No results."
      placeholder="Search court address, name..."
      onValueChange={handleChange}
      value={value}
    />
  );
}
