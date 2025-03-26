import { useState, useEffect } from "react";
import { StudentInfoState } from "./StudentInfo.types";
import { fetchStudent, fetchStudentCourses, deleteInscription } from "./StudentInfo.service";

export const useStudentInfo = (id: string): StudentInfoState & {
  removeInscription: (courseId: string, userId: string) => Promise<void>;
} => {
  const [state, setState] = useState<StudentInfoState>({
    student: null,
    courses: [],
    loading: true,
    error: null,
  });

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [studentData, coursesData] = await Promise.all([
        fetchStudent(id),
        fetchStudentCourses(id)
      ]);

      setState({
        student: studentData,
        courses: coursesData,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        student: null,
        courses: [],
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  const removeInscription = async (courseId: string, userId: string) => {
    try {
      await deleteInscription(courseId, userId);
      setState(prev => ({
        ...prev,
        courses: prev.courses.filter(course => course.courseId !== courseId),
      }));
    } catch (error) {
      console.error("Error al eliminar inscripción:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return { ...state, removeInscription };
};