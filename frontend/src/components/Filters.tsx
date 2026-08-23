import { SearchParams } from "../types";

const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Coupe", "Truck"];

interface Props {
  params: SearchParams;
  onChange: (params: SearchParams) => void;
}

export function Filters({ params, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        aria-label="Filter by category"
        value={params.category ?? ""}
        onChange={(e) => onChange({ ...params, category: e.target.value || undefined })}
        className="rounded-md border border-steel-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by availability"
        value={params.available ?? ""}
        onChange={(e) => onChange({ ...params, available: (e.target.value || undefined) as "true" | "false" | undefined })}
        className="rounded-md border border-steel-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
      >
        <option value="">All availability</option>
        <option value="true">Available only</option>
        <option value="false">Out of stock only</option>
      </select>

      <select
        aria-label="Sort vehicles"
        value={params.sort ?? ""}
        onChange={(e) => onChange({ ...params, sort: (e.target.value || undefined) as SearchParams["sort"] })}
        className="rounded-md border border-steel-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
      >
        <option value="">Sort: default</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="name_asc">Name: A to Z</option>
      </select>
    </div>
  );
}
