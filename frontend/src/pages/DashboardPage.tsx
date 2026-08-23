import { useState } from "react";
import { LogOut, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useVehicles } from "../hooks/useVehicles";
import { SearchBar } from "../components/SearchBar";
import { Filters } from "../components/Filters";
import { VehicleCard } from "../components/VehicleCard";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { RestockModal } from "../components/RestockModal";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";
import { Toast, ToastState } from "../components/Toast";
import { SearchParams, Vehicle, VehicleFormInput } from "../types";
import {
  createVehicleRequest,
  deleteVehicleRequest,
  purchaseVehicleRequest,
  restockVehicleRequest,
  updateVehicleRequest
} from "../api/vehicles";
import { ApiRequestError } from "../api/client";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [params, setParams] = useState<SearchParams>({});
  const { vehicles, status, error, reload, setVehicles } = useVehicles(params);

  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(type: ToastState["type"], message: string) {
    setToast({ type, message });
  }

  async function handlePurchase(vehicle: Vehicle) {
    setPurchasingId(vehicle.id);
    try {
      const updated = await purchaseVehicleRequest(vehicle.id);
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      showToast("success", `Purchased ${vehicle.make} ${vehicle.model}.`);
    } catch (err) {
      showToast("error", err instanceof ApiRequestError ? err.message : "Purchase failed.");
    } finally {
      setPurchasingId(null);
    }
  }

  async function handleCreate(input: VehicleFormInput) {
    const created = await createVehicleRequest(input);
    setVehicles((prev) => [created, ...prev]);
    setIsCreating(false);
    showToast("success", "Vehicle added successfully.");
  }

  async function handleUpdate(input: VehicleFormInput) {
    if (!editingVehicle) return;
    const updated = await updateVehicleRequest(editingVehicle.id, input);
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setEditingVehicle(null);
    showToast("success", "Vehicle updated successfully.");
  }

  async function handleRestock(amount: number) {
    if (!restockingVehicle) return;
    const updated = await restockVehicleRequest(restockingVehicle.id, amount);
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setRestockingVehicle(null);
    showToast("success", "Vehicle restocked.");
  }

  async function handleDelete() {
    if (!deletingVehicle) return;
    setIsDeleting(true);
    try {
      await deleteVehicleRequest(deletingVehicle.id);
      setVehicles((prev) => prev.filter((v) => v.id !== deletingVehicle.id));
      showToast("success", "Vehicle deleted.");
      setDeletingVehicle(null);
    } catch (err) {
      showToast("error", err instanceof ApiRequestError ? err.message : "Unable to delete vehicle.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-steel-50">
      <header className="border-b border-steel-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">
              Ridgeline Motors
            </p>
            <h1 className="font-display text-xl font-semibold text-ink-950">Inventory</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-steel-500">
              {user?.name} <span className="text-steel-300">·</span>{" "}
              <span className="font-medium text-ink-900">{user?.role}</span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-md border border-steel-200 px-3 py-2 text-sm font-medium text-ink-900 hover:bg-steel-50"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="sm:max-w-xs sm:flex-1">
              <SearchBar value={params.q ?? ""} onChange={(q) => setParams((p) => ({ ...p, q: q || undefined }))} />
            </div>
            <Filters params={params} onChange={setParams} />
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center gap-1.5 rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              <Plus size={16} /> Add vehicle
            </button>
          )}
        </div>

        {status === "loading" && <p className="text-sm text-steel-500">Loading inventory…</p>}

        {status === "error" && (
          <div className="rounded-md bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
            {error}{" "}
            <button type="button" onClick={reload} className="font-semibold underline">
              Try again
            </button>
          </div>
        )}

        {status === "success" && vehicles.length === 0 && (
          <p className="rounded-md border border-dashed border-steel-200 bg-white px-4 py-8 text-center text-sm text-steel-500">
            No vehicles match your search.
          </p>
        )}

        {status === "success" && vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={isAdmin}
                purchasingId={purchasingId}
                onPurchase={handlePurchase}
                onEdit={setEditingVehicle}
                onDelete={setDeletingVehicle}
                onRestock={setRestockingVehicle}
              />
            ))}
          </div>
        )}
      </main>

      {isCreating && (
        <VehicleFormModal vehicle={null} onClose={() => setIsCreating(false)} onSubmit={handleCreate} />
      )}

      {editingVehicle && (
        <VehicleFormModal vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} onSubmit={handleUpdate} />
      )}

      {restockingVehicle && (
        <RestockModal
          vehicle={restockingVehicle}
          onClose={() => setRestockingVehicle(null)}
          onSubmit={handleRestock}
        />
      )}

      {deletingVehicle && (
        <ConfirmDeleteDialog
          vehicle={deletingVehicle}
          onCancel={() => setDeletingVehicle(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
