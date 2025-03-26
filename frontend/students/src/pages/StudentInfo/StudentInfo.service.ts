import { Student, Course } from "./StudentInfo.types";

const API_BASE_URL = "http://localhost:3000/api";

export const fetchStudent = async (id: string): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`);
  if (!response.ok) throw new Error("Error al obtener la información del estudiante");
  return response.json();
};

export const fetchStudentCourses = async (userId: string): Promise<Course[]> => {
  const response = await fetch(`${API_BASE_URL}/inscriptions/?userId=${userId}`);
  if (!response.ok) throw new Error("Error al obtener los cursos inscritos");
  return response.json();
};

export const deleteInscription = async (courseId: string, userId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/inscriptions`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, userId }),
  });

  if (!response.ok) throw new Error("Error al eliminar la inscripción");
};