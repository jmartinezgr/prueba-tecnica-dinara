import { Course } from './CoursesList.types';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${API_BASE_URL}/courses`);
  if (!response.ok) throw new Error("Error al obtener los cursos");
  return response.json();
};

export const deleteCourse = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el curso");
};