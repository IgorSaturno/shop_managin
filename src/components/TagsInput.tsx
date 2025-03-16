import { useCallback, useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagsInputProps {
  initialTags?: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsInput({ initialTags = [], onTagsChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);

  const addTag = useCallback(() => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      onTagsChange(newTags);
    }
    setInputValue("");
  }, [inputValue, tags, onTagsChange]);

  const removeTag = useCallback(
    (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
      onTagsChange(newTags);
    },
    [tags, onTagsChange],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="rounded-full hover:bg-blue-200"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite tags e pressione Enter"
        className="w-full rounded-md border p-2 text-sm"
      />

      <p className="text-sm text-muted-foreground">
        Separe tags com vírgula ou pressione Enter
      </p>
    </div>
  );
}
