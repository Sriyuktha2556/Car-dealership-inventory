import { Vehicle } from "../types";

interface Props {
  vehicle: Vehicle;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function ConfirmDeleteDialog({ vehicle, onCancel, onConfirm, isDeleting }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl"
      >
        <h2 id="delete-dialog-title" className="font-display text-lg font-semibold text-ink-950">Delete vehicle?</h2>
        <p className="mt-2 text-sm text-steel-500">
          This will permanently remove {vehicle.make} {vehicle.model} from inventory. This cannot be undone.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-steel-200 px-4 py-2 text-sm font-medium text-ink-900 hover:bg-steel-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-signal-red px-4 py-2 text-sm font-semibold text-white hover:bg-signal-red/90 disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
