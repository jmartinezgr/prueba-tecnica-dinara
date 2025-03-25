import { z } from "zod";

// Esquema de validación
export const formSchema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
  name: z.string().min(1, "El nombre del curso es obligatorio"),
  professor: z.string().min(1, "El nombre del profesor es obligatorio"),
  maxSlots: z.number().min(1, "El número máximo de cupos debe ser al menos 1"),
});

export type FormFields = z.infer<typeof formSchema>;

export type CourseData = FormFields & {
  enrolledStudents?: number;
};

export type DialogState = {
  open: boolean;
  success: boolean;
  message: string;
};