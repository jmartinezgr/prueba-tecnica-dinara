import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StudentInfo from "../StudentInfo";

global.fetch = jest.fn();

const mockStudent = {
  id: "1",
  firstName: "Juan",
  lastName: "Pérez",
  documentDepartment: "Antioquia",
  documentPlace: "Medellín",
  gender: "Masculino",
  ethnicity: "Mestizo",
  personalEmail: "juan@example.com",
  institutionalEmail: "juan@university.edu",
  mobilePhone: "123456789",
  landlinePhone: "987654321",
  birthDate: "2000-01-01",
  nationality: "Colombiano",
};

const mockCourses = [
  {
    courseId: "101",
    userId: "1",
    courseDetails: {
      id: "101",
      name: "Matemáticas",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-01",
      enrolledStudents: 30,
      maxSlots: 40,
      professor: "Dr. Ramírez",
    },
  },
];

const setup = async () => {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudent,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses,
    });

  render(
    <MemoryRouter initialEntries={["/students/1"]}>
      <Routes>
        <Route path="/students/:id" element={<StudentInfo />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText("Información del Estudiante")).toBeInTheDocument());
};

test("muestra un spinner mientras se cargan los datos", () => {
  (fetch as jest.Mock).mockResolvedValueOnce(new Promise(() => {}));

  render(
    <MemoryRouter initialEntries={["/students/1"]}>
      <Routes>
        <Route path="/students/:id" element={<StudentInfo />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

test("muestra la información del estudiante correctamente", async () => {
  await setup();
  expect(screen.getByText("Nombre: Juan")).toBeInTheDocument();
  expect(screen.getByText("Apellido: Pérez")).toBeInTheDocument();
  expect(screen.getByText("Email personal: juan@example.com")).toBeInTheDocument();
  expect(screen.getByText("Email institucional: juan@university.edu")).toBeInTheDocument();
});

test("muestra los cursos inscritos correctamente", async () => {
  await setup();
  expect(screen.getByText("Matemáticas")).toBeInTheDocument();
  expect(screen.getByText("Dr. Ramírez")).toBeInTheDocument();
});

test("muestra un mensaje de error si la carga falla", async () => {
  (fetch as jest.Mock).mockRejectedValueOnce(new Error("Error al obtener datos"));

  render(
    <MemoryRouter initialEntries={["/students/1"]}>
      <Routes>
        <Route path="/students/:id" element={<StudentInfo />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText(/Error al obtener datos/i)).toBeInTheDocument());
});

test("elimina un curso correctamente", async () => {
  await setup();

  (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

  const deleteButton = screen.getByText("Eliminar");
  fireEvent.click(deleteButton);

  await waitFor(() => expect(screen.queryByText("Matemáticas")).not.toBeInTheDocument());
});
