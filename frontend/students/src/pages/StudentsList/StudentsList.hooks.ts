import { useState, useEffect } from "react";
import { StudentsListState } from "./StudentsList.types";
import { fetchStudents, deleteStudent } from "./StudentsList.service";

export const useStudentsList = (): StudentsListState & {
  removeStudent: (id: string) => Promise<void>;
} => {
  const [state, setState] = useState<StudentsListState>({
    data: [],
    loading: true,
    error: null,
  });

  const loadStudents = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await fetchStudents();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(student => student.id !== id),
      }));
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return { ...state, removeStudent };
};