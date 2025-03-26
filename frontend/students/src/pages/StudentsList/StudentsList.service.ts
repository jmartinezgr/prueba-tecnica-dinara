import { API_BASE_URL } from "../../config";
import { Student } from "./StudentsList.types";

export const fetchStudents = async (): Promise<Student[]> => {
  console.log(API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/students`);
  if (!response.ok) 
    {
      console.log(response);
      throw new Error("Error al obtener los estudiantes");}
  return response.json();
};

export const deleteStudent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar el estudiante");
};