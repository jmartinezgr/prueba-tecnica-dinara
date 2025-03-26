import { z } from "zod";
import { FormFields } from "./InscribeStudent.types";

export const schema = z.object({
  userId: z.string().min(1, "El estudiante es obligatorio"),
  courseId: z.string().min(1, "El curso es obligatorio"),
}) satisfies z.ZodType<FormFields>;