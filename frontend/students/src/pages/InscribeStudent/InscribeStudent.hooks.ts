import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./InscribeStudent.schema";
import { FormFields, DialogState, Option } from "./InscribeStudent.types";
import { fetchStudents, fetchCourses } from "./InscribeStudent.service";

export const useInscriptionForm = () => {
  return useForm<FormFields>({
    resolver: zodResolver(schema),
  });
};

export const useDialog = (initialState: DialogState = {
  open: false,
  success: false,
  message: ""
}) => {
  const [dialog, setDialog] = useState<DialogState>(initialState);

  const closeDialog = () => setDialog(prev => ({ ...prev, open: false }));

  return { dialog, setDialog, closeDialog };
};

export const useOptions = () => {
  const [students, setStudents] = useState<Option[]>([]);
  const [courses, setCourses] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [studentsData, coursesData] = await Promise.all([
          fetchStudents(),
          fetchCourses()
        ]);
        setStudents(studentsData);
        setCourses(coursesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setStudents([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  return { students, courses, loading, error };
};