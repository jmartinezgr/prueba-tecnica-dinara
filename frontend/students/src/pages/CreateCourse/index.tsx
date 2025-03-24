import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Esquema de validación con Zod
const schema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
  name: z.string().min(1, "El nombre del curso es obligatorio"),
  professor: z.string().min(1, "El nombre del profesor es obligatorio"),
  maxSlots: z.number().min(1, "El número máximo de cupos debe ser al menos 1"),
  enrolledStudents: z.number().min(0, "El número de estudiantes inscritos no puede ser negativo"),
});

type FormFields = z.infer<typeof schema>;

const CreateCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  const [dialog, setDialog] = useState({ open: false, success: true, message: "" });

  const onSubmit = async (data: FormFields) => {
    try {
      console.log("Datos enviados:", data);
      const response = await fetch("http://localhost:3000/api/courses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || "Ocurrió un error inesperado.";
        setDialog({ open: true, success: false, message: `Error: ${errorMessage}` });
        return;
      }

      setDialog({ open: true, success: true, message: "El curso ha sido creado con éxito." });
      reset();
    } catch {
      setDialog({ open: true, success: false, message: "Error: No se pudo conectar con el servidor." });
    }
  };

  return (
    <Container maxWidth="lg">
      <h4>Crear Curso</h4>
      <Paper elevation={0} sx={{ p: 4, mt: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Campo: ID del curso */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID del Curso *"
                {...register("id")}
                error={!!errors.id}
                helperText={errors.id?.message || ""}
              />
            </Grid>

            {/* Campo: Nombre del curso */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del Curso *"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message || ""}
              />
            </Grid>

            {/* Campo: Nombre del profesor */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profesor *"
                {...register("professor")}
                error={!!errors.professor}
                helperText={errors.professor?.message || ""}
              />
            </Grid>

            {/* Campo: Número máximo de cupos */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cupos Máximos *"
                type="number"
                {...register("maxSlots", { valueAsNumber: true })}
                error={!!errors.maxSlots}
                helperText={errors.maxSlots?.message || ""}
              />
            </Grid>

            {/* Campo: Estudiantes inscritos (opcional, por defecto 0) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estudiantes Inscritos"
                type="number"
                {...register("enrolledStudents", { valueAsNumber: true })}
                error={!!errors.enrolledStudents}
                helperText={errors.enrolledStudents?.message || ""}
                defaultValue={0}
              />
            </Grid>

            {/* Botón de envío */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Crear Curso
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Diálogo de éxito o error */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
        <DialogTitle>{dialog.success ? "Éxito" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateCourse;