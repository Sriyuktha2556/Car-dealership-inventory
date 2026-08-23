import { Pencil, Trash2, PackagePlus } from "lucide-react";
import { Vehicle } from "../types";

interface Props {
  vehicle: Vehicle;
  isAdmin: boolean;
  onPurchase: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
  purchasingId: number | null;
}

function stockStatus(quantity: number): { label: string; className: string } {
  if (quantity === 0) return { label: "Out of Stock", className: "bg-signal-red/10 text-signal-red" };
  if (quantity <= 2) return { label: "Low Stock", className: "bg-signal-amber/10 text-signal-amber" };
  return { label: "In Stock", className: "bg-signal-green/10 text-signal-green" };
}

export function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock, purchasingId }: Props) {
  const status = stockStatus(vehicle.quantity);
  const price = Number(vehicle.price).toLocaleString("en-US", { style: "currency", currency: "USD" });
  const isPurchasing = purchasingId === vehicle.id;

  return (
    <div className="flex flex-col justify-between rounded-lg border border-steel-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-steel-400">{vehicle.category}</p>
            <h3 className="font-display text-lg font-semibold text-ink-950">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>
        <p className="mb-4 font-display text-xl font-semibold text-ink-900">{price}</p>
        <p className="mb-4 text-sm text-steel-500">{vehicle.quantity} available</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onPurchase(vehicle)}
          disabled={vehicle.quantity === 0 || isPurchasing}
          className="flex-1 rounded-md bg-ink-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-steel-200 disabled:text-steel-500"
        >
          {vehicle.quantity === 0 ? "Out of Stock" : isPurchasing ? "Purchasing…" : "Purchase"}
        </button>

        {isAdmin && (
          <>
            <button
              type="button"
              aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
              onClick={() => onEdit(vehicle)}
              className="rounded-md border border-steel-200 p-2 text-steel-600 transition hover:bg-steel-50"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
              onClick={() => onRestock(vehicle)}
              className="rounded-md border border-steel-200 p-2 text-steel-600 transition hover:bg-steel-50"
            >
              <PackagePlus size={16} />
            </button>
            <button
              type="button"
              aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
              onClick={() => onDelete(vehicle)}
              className="rounded-md border border-steel-200 p-2 text-signal-red transition hover:bg-signal-red/10"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
