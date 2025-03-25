import { useState, useEffect } from 'react';
import { CourseDetails, Student } from './CourseInfo.types';
import { fetchCourse, fetchInscriptions, fetchStudent } from './CourseInfo.service';

export const useCourseData = (id: string) => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseData = await fetchCourse(id);
        setCourse(courseData);

        const inscriptions = await fetchInscriptions(id);
        const studentsData = await Promise.all(
          inscriptions.map(inscription => fetchStudent(inscription.userId))
        );

        setStudents(studentsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  return { course, students, loading, error, setStudents };
};