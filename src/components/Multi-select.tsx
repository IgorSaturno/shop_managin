import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onValueChange,
  placeholder = "Selecione...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onValueChange(newValues);
    setIsOpen(true);
  };

  return (
    <Select
      value=""
      onValueChange={handleSelect}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className="flex h-auto min-h-8 w-[180px] flex-wrap gap-1">
        {selectedValues.length > 0 ? (
          selectedValues.map((value) => {
            const label = options.find((opt) => opt.value === value)?.label;
            return (
              <div
                key={value}
                className="flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-sm text-accent-foreground"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(value);
                  }}
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </div>
            );
          })
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                readOnly
                className="h-4 w-4 accent-primary"
              />
              <span className="truncate">{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
