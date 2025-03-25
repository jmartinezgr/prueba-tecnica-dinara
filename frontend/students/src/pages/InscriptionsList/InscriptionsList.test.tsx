import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InscriptionsList from "../InscriptionsList";

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("muestra un spinner mientras carga los datos", async () => {
  (fetch as jest.Mock).mockResolvedValueOnce(
    new Response(JSON.stringify([]), { status: 200 })
  );

  render(<InscriptionsList />);
  
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());
});

test("muestra las inscripciones después de cargar", async () => {
  (fetch as jest.Mock).mockResolvedValueOnce(
    new Response(JSON.stringify([{ userId: "123", courseId: "456" }]), { status: 200 })
  );

  render(<InscriptionsList />);
  
  expect(await screen.findByText("123")).toBeInTheDocument();
  expect(screen.getByText("456")).toBeInTheDocument();
});

test("muestra un mensaje de error si la petición falla", async () => {
  (fetch as jest.Mock).mockRejectedValueOnce(new Error("Error al obtener las inscripciones"));

  render(<InscriptionsList />);
  
  expect(await screen.findByText(/error al obtener las inscripciones/i)).toBeInTheDocument();
});

test("elimina una inscripción al hacer clic en el botón de eliminar", async () => {
  (fetch as jest.Mock).mockResolvedValueOnce(
    new Response(JSON.stringify([{ userId: "123", courseId: "456" }]), { status: 200 })
  );

  render(<InscriptionsList />);
  
  await screen.findByText("123"); // Esperar a que se cargue la tabla

  (fetch as jest.Mock).mockResolvedValueOnce(new Response(null, { status: 200 }));

  const deleteButton = screen.getByRole("button", { name: /eliminar/i });
  await userEvent.click(deleteButton);

  await waitFor(() => expect(screen.queryByText("123")).not.toBeInTheDocument());
});