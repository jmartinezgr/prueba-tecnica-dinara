import { Student } from "./StudentsList.types";

const API_BASE_URL = "http://localhost:3000/api";

export const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${API_BASE_URL}/students`);
  if (!response.ok) throw new Error("Error al obtener los estudiantes");
  return response.json();
};

export const deleteStudent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar el estudiante");
};