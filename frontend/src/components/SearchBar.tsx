import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(draft), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Search by make, model, or category"
        aria-label="Search vehicles"
        className="w-full rounded-md border border-steel-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
      />
    </div>
  );
}
