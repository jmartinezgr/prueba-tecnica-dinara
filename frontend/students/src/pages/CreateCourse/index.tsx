import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
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

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(!!id); // Cargar solo si hay ID
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  const [dialog, setDialog] = useState({ open: false, success: true, message: "" });

  // Cargar datos del curso si estamos en modo edición
  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${id}`);
        
        if (!response.ok) {
          throw new Error("Curso no encontrado");
        }

        const courseData = await response.json();
        reset(courseData);
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

    fetchCourse();
  }, [id, reset, navigate]);

  const onSubmit = async (data: FormFields) => {
    try {
      if (isEditMode) {
        // Petición PATCH para actualizar
        const response = await fetch(`http://localhost:3000/api/courses/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            professor: data.professor,
            maxSlots: data.maxSlots
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData?.message || "Ocurrió un error al actualizar el curso.";
          throw new Error(errorMessage);
        }

        setDialog({ open: true, success: true, message: "El curso ha sido actualizado con éxito." });
      } else {
        // Petición POST para crear
        const response = await fetch("http://localhost:3000/api/courses/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData?.message || "Ocurrió un error al crear el curso.";
          throw new Error(errorMessage);
        }

        setDialog({ open: true, success: true, message: "El curso ha sido creado con éxito." });
        reset();
      }
    } catch (error) {
      setDialog({
        open: true,
        success: false,
        message: error instanceof Error ? error.message : "Error inesperado",
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, mt: 1, textAlign: "center" }}>
          Cargando curso...
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <h4>{isEditMode ? "Editar Curso" : "Crear Curso"}</h4>
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
                disabled={isEditMode}
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Campo: Estudiantes inscritos (solo lectura en modo edición) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estudiantes Inscritos"
                type="number"
                {...register("enrolledStudents", { valueAsNumber: true })}
                error={!!errors.enrolledStudents}
                helperText={errors.enrolledStudents?.message || ""}
                disabled={isEditMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Botón de envío */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEditMode ? "Actualizar Curso" : "Crear Curso"}
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
          <Button 
            onClick={() => {
              setDialog({ ...dialog, open: false });
              if (dialog.success && !isEditMode) {
                navigate("/courses");
              }
            }} 
            color="primary" 
            autoFocus
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseForm;