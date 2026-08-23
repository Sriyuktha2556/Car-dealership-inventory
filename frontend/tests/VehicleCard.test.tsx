import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VehicleCard } from "../src/components/VehicleCard";
import { Vehicle } from "../src/types";

const baseVehicle: Vehicle = {
  id: 1,
  make: "Toyota",
  model: "Camry",
  category: "Sedan",
  price: "28500.00",
  quantity: 5,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z"
};

function noop() {}

describe("VehicleCard", () => {
  it("renders make, model, price, and stock status", () => {
    render(
      <VehicleCard
        vehicle={baseVehicle}
        isAdmin={false}
        onPurchase={noop}
        onEdit={noop}
        onDelete={noop}
        onRestock={noop}
        purchasingId={null}
      />
    );

    expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
    expect(screen.getByText("$28,500.00")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("enables the purchase button when quantity is greater than zero", () => {
    render(
      <VehicleCard
        vehicle={baseVehicle}
        isAdmin={false}
        onPurchase={noop}
        onEdit={noop}
        onDelete={noop}
        onRestock={noop}
        purchasingId={null}
      />
    );

    expect(screen.getByRole("button", { name: /purchase/i })).toBeEnabled();
  });

  it("disables purchase and shows Out of Stock when quantity is zero", () => {
    render(
      <VehicleCard
        vehicle={{ ...baseVehicle, quantity: 0 }}
        isAdmin={false}
        onPurchase={noop}
        onEdit={noop}
        onDelete={noop}
        onRestock={noop}
        purchasingId={null}
      />
    );

    const button = screen.getByRole("button", { name: /out of stock/i });
    expect(button).toBeDisabled();
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("calls onPurchase when the purchase button is clicked", async () => {
    const onPurchase = vi.fn();
    const user = userEvent.setup();

    render(
      <VehicleCard
        vehicle={baseVehicle}
        isAdmin={false}
        onPurchase={onPurchase}
        onEdit={noop}
        onDelete={noop}
        onRestock={noop}
        purchasingId={null}
      />
    );

    await user.click(screen.getByRole("button", { name: /purchase/i }));
    expect(onPurchase).toHaveBeenCalledWith(baseVehicle);
  });

  it("hides admin controls for normal users", () => {
    render(
      <VehicleCard
        vehicle={baseVehicle}
        isAdmin={false}
        onPurchase={noop}
        onEdit={noop}
        onDelete={noop}
        onRestock={noop}
        purchasingId={null}
      />
    );

    expect(screen.queryByLabelText(/edit toyota camry/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/delete toyota camry/i)).not.toBeInTheDocument();
  });

  it("shows admin controls for admin users", () => {
    render(
      <VehicleCard
        vehicle={baseVehicle}
        isAdmin={true}
        onPurchase={noop}
        onEdit={noop}
        onDelete={noop}
        onRestock={noop}
        purchasingId={null}
      />
    );

    expect(screen.getByLabelText(/edit toyota camry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete toyota camry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/restock toyota camry/i)).toBeInTheDocument();
  });
});
