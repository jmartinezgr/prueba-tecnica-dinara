import { API_BASE_URL } from '../../config';
import { CourseDetails, Student, Inscription } from './CourseInfo.types';

export const fetchCourse = async (id: string): Promise<CourseDetails> => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`);
  if (!response.ok) throw new Error("Error al obtener la información del curso");
  return response.json();
};

export const fetchInscriptions = async (courseId: string): Promise<Inscription[]> => {
  const response = await fetch(`${API_BASE_URL}/inscriptions/?courseId=${courseId}`);
  if (!response.ok) throw new Error("Error al obtener los estudiantes inscritos");
  return response.json();
};

export const fetchStudent = async (userId: string): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/students/${userId}`);
  if (!response.ok) throw new Error("Error al obtener la información del estudiante");
  return response.json();
};

export const deleteInscription = async (userId: string, courseId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/inscriptions`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, courseId }),
  });
  if (!response.ok) throw new Error("Error al eliminar la inscripción");
};