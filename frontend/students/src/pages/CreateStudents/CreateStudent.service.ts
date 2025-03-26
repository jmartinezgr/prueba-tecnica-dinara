import { FormFields } from "./CreateStudent.types";

export const createStudent = async (studentData: FormFields) => {
  const response = await fetch("http://localhost:3000/api/students/", {
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