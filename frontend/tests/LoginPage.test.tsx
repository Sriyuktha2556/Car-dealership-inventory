import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "../src/pages/LoginPage";
import { AuthProvider } from "../src/context/AuthContext";

vi.mock("../src/api/auth", () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn()
}));

import { loginRequest } from "../src/api/auth";

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  it("shows a validation message when fields are empty", async () => {
    renderLogin();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/enter your email and password/i);
  });

  it("submits credentials and surfaces a login error", async () => {
    vi.mocked(loginRequest).mockRejectedValueOnce(new Error("Invalid email or password"));
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(loginRequest).toHaveBeenCalledWith("test@example.com", "wrongpass"));
  });
});
