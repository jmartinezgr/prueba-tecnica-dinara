import { CourseData, FormFields } from "./CourseForm.types";

const API_BASE_URL = "http://localhost:3000/api";

export const fetchCourse = async (id: string): Promise<CourseData> => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Curso no encontrado");
  }
  return response.json();
};

export const createCourse = async (data: FormFields): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/courses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Error al crear el curso");
  }
};

export const updateCourse = async (id: string, data: Omit<CourseData, "id">): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Error al actualizar el curso");
  }
};