import { API_BASE_URL } from "../../config";
import { FormFields } from "./CreateStudent.types";

export const createStudent = async (studentData: FormFields) => {
  const response = await fetch(`${API_BASE_URL}/students/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Ocurrió un error inesperado.");
  }

  return response.json();
};