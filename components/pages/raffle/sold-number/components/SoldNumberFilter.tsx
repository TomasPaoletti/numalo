"use client";

import { Search, X } from "lucide-react";

import { useSelectedNumbers } from "@/contexts/SelectedNumbersContext";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const SoldNumberFilter = () => {
  const { filter, setFilter } = useSelectedNumbers();

  const handleChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setFilter(numericValue);
  };

  const clearFilter = () => {
    setFilter("");
  };

  return (
    <section id="sold-number-filter" className="mb-4 w-full">
      <InputGroup>
        <InputGroupInput
          type="text"
          inputMode="numeric"
          placeholder="Buscar número"
          value={filter}
          onChange={(e) => handleChange(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        {filter && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Clear"
              title="Clear"
              size="icon-xs"
              onClick={clearFilter}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </section>
  );
};

export default SoldNumberFilter;
