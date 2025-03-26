import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import InscribeStudent from ".";

const mockStudents = [
  { id: "123", name: "Juan Pérez" },
  { id: "456", name: "María Gómez" },
];

const mockCourses = [
  { id: "789", name: "Matemáticas" },
  { id: "101", name: "Física" },
];

describe("InscribeStudent Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn((url) => {
      if (url.includes("students")) {
        return Promise.resolve({ json: () => Promise.resolve(mockStudents) });
      }
      if (url.includes("courses")) {
        return Promise.resolve({ json: () => Promise.resolve(mockCourses) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Inscripción realizada con éxito." }),
      });
    }) as unknown as jest.Mock;
  });

  it("debería renderizar el formulario", async () => {
    render(<InscribeStudent />);

    expect(screen.getByText("Inscribir Estudiante a Curso")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Estudiante *")).toBeInTheDocument());
    expect(screen.getByLabelText("Curso *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /inscribir/i })).toBeInTheDocument();
  });

  it("debería mostrar errores de validación si se envía vacío", async () => {
    render(<InscribeStudent />);

    fireEvent.click(screen.getByRole("button", { name: /inscribir/i }));

    await waitFor(() => {
      expect(screen.getByText("El estudiante es obligatorio")).toBeInTheDocument();
      expect(screen.getByText("El curso es obligatorio")).toBeInTheDocument();
    });
  });

  it("debería mostrar mensaje de éxito tras inscripción", async () => {
    render(<InscribeStudent />);

    fireEvent.change(screen.getByLabelText("Estudiante *"), { target: { value: "Juan Pérez" } });
    fireEvent.change(screen.getByLabelText("Curso *"), { target: { value: "Matemáticas" } });
    fireEvent.click(screen.getByRole("button", { name: /inscribir/i }));

    await waitFor(() => {
      expect(screen.getByText("Éxito")).toBeInTheDocument();
      expect(screen.getByText("Inscripción realizada con éxito.")).toBeInTheDocument();
    });
  });

  it("debería mostrar error si no hay cupo en el curso", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "No hay cupo en el curso" }),
      })
    ) as unknown as jest.Mock;

    render(<InscribeStudent />);

    fireEvent.change(screen.getByLabelText("Estudiante *"), { target: { value: "Juan Pérez" } });
    fireEvent.change(screen.getByLabelText("Curso *"), { target: { value: "Matemáticas" } });
    fireEvent.click(screen.getByRole("button", { name: /inscribir/i }));

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("No hay cupo en el curso. Modifica la capacidad del curso si lo deseas.")).toBeInTheDocument();
    });
  });
});
