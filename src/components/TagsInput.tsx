import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TagsInputProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsInput({
  availableTags = [],
  selectedTags = [],
  onTagsChange,
}: TagsInputProps) {
  const [open, setOpen] = useState(false);

  // Garantia de tipos e valores válidos
  const safeAvailableTags = Array.isArray(availableTags)
    ? availableTags.filter((tag) => typeof tag === "string")
    : [];

  const safeSelectedTags = Array.isArray(selectedTags)
    ? selectedTags.filter((tag) => typeof tag === "string")
    : [];

  const toggleTag = (tag: string) => {
    const newTags = safeSelectedTags.includes(tag)
      ? safeSelectedTags.filter((t) => t !== tag)
      : [...safeSelectedTags, tag];
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {safeSelectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => toggleTag(tag)}
              className="ml-1 rounded-full hover:bg-accent"
              aria-label={`Remover tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
            aria-expanded={open}
          >
            Selecionar tags...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Pesquisar tags..." />
            <CommandEmpty>Nenhuma tag encontrada</CommandEmpty>
            <CommandGroup className="max-h-48 overflow-y-auto">
              {safeAvailableTags.map((tag) => (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => toggleTag(tag)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeSelectedTags.includes(tag)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {tag}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
