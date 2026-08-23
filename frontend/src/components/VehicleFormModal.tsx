import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { Vehicle, VehicleFormInput } from "../types";

interface Props {
  vehicle: Vehicle | null; // null = create mode
  onClose: () => void;
  onSubmit: (input: VehicleFormInput) => Promise<void>;
}

const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Coupe", "Truck"];

export function VehicleFormModal({ vehicle, onClose, onSubmit }: Props) {
  const [make, setMake] = useState(vehicle?.make ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [category, setCategory] = useState(vehicle?.category ?? CATEGORIES[0]);
  const [price, setPrice] = useState(vehicle ? String(vehicle.price) : "");
  const [quantity, setQuantity] = useState(vehicle ? String(vehicle.quantity) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!make.trim()) next.make = "Make is required.";
    if (!model.trim()) next.model = "Model is required.";
    if (!category.trim()) next.category = "Category is required.";
    if (!(Number(price) > 0)) next.price = "Price must be greater than zero.";
    if (!(Number(quantity) >= 0) || !Number.isInteger(Number(quantity))) next.quantity = "Quantity cannot be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        make: make.trim(),
        model: model.trim(),
        category,
        price: Number(price),
        quantity: Number(quantity)
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to save vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-form-title"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="vehicle-form-title" className="font-display text-lg font-semibold text-ink-950">
            {vehicle ? "Edit vehicle" : "Add vehicle"}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-steel-400 hover:text-ink-900">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <TextField id="make" label="Make" value={make} onChange={setMake} error={errors.make} />
            <TextField id="model" label="Model" value={model} onChange={setModel} error={errors.model} />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-ink-900">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-steel-200 px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <TextField id="price" label="Price ($)" type="number" value={price} onChange={setPrice} error={errors.price} />
            <TextField
              id="quantity"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={setQuantity}
              error={errors.quantity}
            />
          </div>

          {formError && (
            <p role="alert" className="mb-4 rounded-md bg-signal-red/10 px-3 py-2 text-sm text-signal-red">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-steel-200 px-4 py-2 text-sm font-medium text-ink-900 hover:bg-steel-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-ink-950 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
            >
              {isSubmitting ? "Saving…" : "Save vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text"
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-md border border-steel-200 px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-signal-red">
          {error}
        </p>
      )}
    </div>
  );
}
