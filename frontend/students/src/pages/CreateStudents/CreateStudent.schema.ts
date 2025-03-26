import { z } from "zod";
import { FormFields } from "./CreateStudent.types";

export const schema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  documentDepartment: z.string().optional(),
  documentPlace: z.string().optional(),
  gender: z.enum(["Masculino", "Femenino", "Otro"]),
  ethnicity: z.string().optional(),
  personalEmail: z.string().email("Email inválido"),
  institutionalEmail: z.string().email("Email institucional inválido"),
  mobilePhone: z.string().optional(),
  landlinePhone: z.string().optional(),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  nationality: z.string().min(1, "La nacionalidad es obligatoria"),
}) satisfies z.ZodType<FormFields>;