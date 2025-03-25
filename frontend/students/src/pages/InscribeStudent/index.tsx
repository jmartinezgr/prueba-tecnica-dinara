import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Autocomplete,
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
  userId: z.string().min(1, "El estudiante es obligatorio"),
  courseId: z.string().min(1, "El curso es obligatorio"),
});

type FormFields = z.infer<typeof schema>;

type Option = { id: string; name: string };

const InscribeStudent = () => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  const [students, setStudents] = useState<Option[]>([]);
  const [courses, setCourses] = useState<Option[]>([]);
  const [dialog, setDialog] = useState({ open: false, success: true, message: "" });

  useEffect(() => {
    fetch("http://localhost:3000/api/students",{ method: "GET"})
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(() => setStudents([]));

    fetch("http://localhost:3000/api/courses", { method: "GET"})
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  const onSubmit = async (data: FormFields) => {
    try {
      const response = await fetch("http://localhost:3000/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setDialog({ open: true, success: false, message: errorData?.message || "Ocurrió un error" });
        return;
      }

      setDialog({ open: true, success: true, message: "Inscripción realizada con éxito." });
    } catch {
      setDialog({ open: true, success: false, message: "Error al conectar con el servidor." });
    }
  };

  return (
    <Container maxWidth="sm" sx={{width: "100%", mt: 4 , alignItems: "center", justifyContent: "center"}}>
      <h4>Inscribir Estudiante a Curso</h4>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={students}
                getOptionLabel={(option) => option.id}
                onChange={(_, value) => setValue("userId", value?.id || "")}
                renderInput={(params) => (
                  <TextField {...params} label="Estudiante *" error={!!errors.userId} helperText={errors.userId?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={courses}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => setValue("courseId", value?.id || "")}
                renderInput={(params) => (
                  <TextField {...params} label="Curso *" error={!!errors.courseId} helperText={errors.courseId?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Inscribir
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Diálogo de éxito o error */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
        <DialogTitle>{dialog.success ? "Éxito" : "Error"}</DialogTitle>
        <DialogContent>
        <DialogContentText>
            {dialog.message === "El usuario ya está inscrito en este curso."
                ? `${dialog.message}. Modifica la capacidad del curso.`
                : dialog.message}
            </DialogContentText>
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

export default InscribeStudent;
