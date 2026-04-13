import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  value,
  onSearch,
  className,
  placeholder = "Find your next great deal...",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(localValue.trim());
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setLocalValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex items-center", className)}
      aria-label="Product search form"
      data-ocid="search-form"
    >
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        size={18}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className={cn(
          "w-full pl-10 pr-10 py-2.5 rounded-full border border-input bg-card",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
          "transition-smooth",
        )}
        data-ocid="search-input"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
          data-ocid="search-clear"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
