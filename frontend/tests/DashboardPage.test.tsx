import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "../src/pages/DashboardPage";
import { AuthProvider } from "../src/context/AuthContext";
import { Vehicle } from "../src/types";

vi.mock("../src/api/vehicles", () => ({
  fetchVehicles: vi.fn(),
  createVehicleRequest: vi.fn(),
  updateVehicleRequest: vi.fn(),
  deleteVehicleRequest: vi.fn(),
  purchaseVehicleRequest: vi.fn(),
  restockVehicleRequest: vi.fn()
}));

import { fetchVehicles } from "../src/api/vehicles";

const sampleVehicle: Vehicle = {
  id: 1,
  make: "Honda",
  model: "Civic",
  category: "Sedan",
  price: "24900.00",
  quantity: 4,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z"
};

function renderDashboard() {
  // Seed a logged-in user directly into localStorage the way AuthProvider expects.
  localStorage.setItem(
    "dealership_auth",
    JSON.stringify({ user: { id: 1, name: "Test User", email: "u@example.com", role: "USER" }, token: "fake" })
  );

  return render(
    <MemoryRouter>
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("DashboardPage", () => {
  it("shows a loading indicator while inventory loads", async () => {
    vi.mocked(fetchVehicles).mockImplementation(() => new Promise(() => {}));
    renderDashboard();

    expect(await screen.findByText(/loading inventory/i)).toBeInTheDocument();
  });

  it("renders vehicles once loaded", async () => {
    vi.mocked(fetchVehicles).mockResolvedValueOnce([sampleVehicle]);
    renderDashboard();

    expect(await screen.findByText("Honda Civic")).toBeInTheDocument();
  });

  it("shows an empty state when no vehicles match", async () => {
    vi.mocked(fetchVehicles).mockResolvedValueOnce([]);
    renderDashboard();

    expect(await screen.findByText(/no vehicles match your search/i)).toBeInTheDocument();
  });

  it("shows an error state when the request fails", async () => {
    vi.mocked(fetchVehicles).mockRejectedValueOnce(new Error("network down"));
    renderDashboard();

    await waitFor(() => expect(screen.getByText(/try again/i)).toBeInTheDocument());
  });

  it("does not show the Add vehicle button for a normal user", async () => {
    vi.mocked(fetchVehicles).mockResolvedValueOnce([sampleVehicle]);
    renderDashboard();

    await screen.findByText("Honda Civic");
    expect(screen.queryByRole("button", { name: /add vehicle/i })).not.toBeInTheDocument();
  });
});
