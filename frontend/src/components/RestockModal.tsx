import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { Vehicle } from "../types";

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
}

export function RestockModal({ vehicle, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const value = Number(amount);
    if (!Number.isInteger(value) || value <= 0) {
      setError("Enter a whole number greater than zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to restock vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="restock-title"
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="restock-title" className="font-display text-lg font-semibold text-ink-950">
            Restock {vehicle.make} {vehicle.model}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-steel-400 hover:text-ink-900">
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm text-steel-500">Currently {vehicle.quantity} in stock.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="restock-amount" className="mb-1 block text-sm font-medium text-ink-900">
            Quantity to add
          </label>
          <input
            id="restock-amount"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={Boolean(error)}
            className="mb-2 w-full rounded-md border border-steel-200 px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
          />
          {error && (
            <p role="alert" className="mb-3 text-xs text-signal-red">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
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
              {isSubmitting ? "Restocking…" : "Restock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
