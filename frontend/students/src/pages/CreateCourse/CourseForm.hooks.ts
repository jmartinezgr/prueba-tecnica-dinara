import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData, FormFields, formSchema, DialogState } from "./CourseForm.types";
import { fetchCourse } from "./CourseForm.service";

export const useCourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [currentEnrolled, setCurrentEnrolled] = useState(0);
  const [dialog, setDialog] = useState<DialogState>({ 
    open: false, 
    success: true, 
    message: "" 
  });

  const form = useForm<FormFields>({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      professor: "",
      maxSlots: 1
    }
  });

  useEffect(() => {
    if (!id) return;

    const loadCourse = async () => {
      try {
        setLoading(true);
        const courseData = await fetchCourse(id);
        
        if (courseData.enrolledStudents !== undefined) {
          setCurrentEnrolled(courseData.enrolledStudents);
        }
        
        form.reset({
          id: courseData.id,
          name: courseData.name,
          professor: courseData.professor,
          maxSlots: courseData.maxSlots
        });
        
        setIsEditMode(true);
      } catch (error) {
        setDialog({
          open: true,
          success: false,
          message: error instanceof Error ? error.message : "Error al cargar el curso",
        });
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, form.reset, navigate]);

  return {
    form,
    isEditMode,
    loading,
    dialog,
    setDialog,
    currentEnrolled,
    navigate
  };
};