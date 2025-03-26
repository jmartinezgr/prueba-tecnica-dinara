import { useState, useEffect } from 'react';
import { Course } from './CoursesList.types';
import { fetchCourses, deleteCourse } from './CoursesList.service';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const removeCourse = async (id: string) => {
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      console.error("Error al eliminar el curso:", (err as Error).message);
    }
  };

  return { courses, loading, error, removeCourse };
};