import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LABELS } from "./labels";

// Esquema de validación con Zod
const schema = z.object({
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
});

type FormFields = z.infer<typeof schema>;

const CreateStudent = () => {
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
      const response = await fetch("http://localhost:3000/api/students/", {
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

      setDialog({ open: true, success: true, message: "El estudiante ha sido creado con éxito." });
      reset();
    } catch {
      setDialog({ open: true, success: false, message: "Error: No se pudo conectar con el servidor." });
    }
  };

  return (
    <Container maxWidth="lg">
      <h4>Crea un Estudiante</h4>
      <Paper elevation={0} sx={{ p: 4, mt: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {LABELS.map(({ label, name, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  type={type || "text"}
                  InputLabelProps={type === "date" ? { shrink: true } : {}}
                  {...register(name as keyof FormFields)} // Asegura que `name` es una clave válida
                  error={!!errors[name as keyof FormFields]} // Asegura que `name` es una clave válida
                  helperText={errors[name as keyof FormFields]?.message || ""} // Asegura que `name` es una clave válida
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Género *"
                defaultValue=""
                {...register("gender")}
                error={!!errors.gender}
                helperText={errors.gender?.message}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Crear Estudiante
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

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

export default CreateStudent;