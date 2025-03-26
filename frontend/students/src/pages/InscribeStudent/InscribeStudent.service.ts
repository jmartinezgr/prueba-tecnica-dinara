import { API_BASE_URL } from "../../config";
import { FormFields, Option } from "./InscribeStudent.types";

export const fetchStudents = async (): Promise<Option[]> => {
  const response = await fetch(`${API_BASE_URL}/students`, { method: "GET" });
  if (!response.ok) throw new Error("Error al obtener estudiantes");
  return response.json();
};

export const fetchCourses = async (): Promise<Option[]> => {
  const response = await fetch(`${API_BASE_URL}/courses`, { method: "GET" });
  if (!response.ok) throw new Error("Error al obtener cursos");
  return response.json();
};

export const createInscription = async (data: FormFields): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/inscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Ocurrió un error al inscribir");
  }
};