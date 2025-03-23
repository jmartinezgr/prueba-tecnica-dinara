import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CreateStudent from "./CreateStudent";

describe("CreateStudent Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 201, // Simula un código de estado 201 (creado)
        json: () =>
          Promise.resolve({
            id: "12345",
            firstName: "Juan",
            lastName: "Pérez",
            personalEmail: "juan@example.com",
            institutionalEmail: "juan@uni.edu",
            birthDate: "2000-01-01",
            nationality: "Colombiana",
          }),
      })
    ) as unknown as jest.Mock;
  });

  it("debería renderizar el formulario", () => {
    render(<CreateStudent />);

    expect(screen.getByText("Crea un Estudiante")).toBeInTheDocument();
    expect(screen.getByLabelText("ID *")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /crear estudiante/i })).toBeInTheDocument();
  });

  it("debería mostrar errores de validación si se envía vacío", async () => {
    render(<CreateStudent />);

    fireEvent.click(screen.getByRole("button", { name: /crear estudiante/i }));

    await waitFor(() => {
      expect(screen.getByText("El ID es obligatorio")).toBeInTheDocument();
      expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
    });
  });

  it("debería mostrar mensaje de éxito tras la creación", async () => {
    render(<CreateStudent />);

    fireEvent.change(screen.getByLabelText("ID *"), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText("Nombre *"), { target: { value: "Juan" } });
    fireEvent.change(screen.getByLabelText("Apellido *"), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByLabelText("Email personal *"), { target: { value: "juan@example.com" } });
    fireEvent.change(screen.getByLabelText("Email institucional *"), { target: { value: "juan@uni.edu" } });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento *"), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByLabelText("Nacionalidad *"), { target: { value: "Colombiana" } });

    fireEvent.click(screen.getByRole("button", { name: /crear estudiante/i }));

    await waitFor(() => {
      expect(screen.getByText("Éxito")).toBeInTheDocument();
      expect(screen.getByText("El estudiante ha sido creado con éxito.")).toBeInTheDocument();
    });
  });
});