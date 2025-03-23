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

const CreateStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const [dialog, setDialog] = useState({ open: false, success: true, message: "" });

  const onSubmit = async (data: any) => {
    try {
      console.log("Datos enviados:", data); // Verifica los datos enviados
      const response = await fetch("http://localhost:3000/api/students/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      console.log("Respuesta de la API:", response); // Verifica la respuesta de la API
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || "Ocurrió un error inesperado.";
        console.log("Error en la respuesta:", errorMessage); // Verifica el mensaje de error
        setDialog({ open: true, success: false, message: `Error: ${errorMessage}` });
        return;
      }
  
      console.log("Estudiante creado con éxito"); // Verifica que se llegó a este punto
      setDialog({ open: true, success: true, message: "El estudiante ha sido creado con éxito." });
      reset();
    } catch (error) {
      console.log("Error en la solicitud:", error); // Verifica errores en la solicitud
      setDialog({ open: true, success: false, message: "Error: No se pudo conectar con el servidor." });
    }
  };
  

  return (
    <Container maxWidth="lg">
      <h4>Crea un Estudiante</h4>
      <Paper elevation={0} sx={{ p: 4, mt: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {[
              { label: "ID *", name: "id" },
              { label: "Nombre *", name: "firstName" },
              { label: "Apellido *", name: "lastName" },
              { label: "Departamento del Documento", name: "documentDepartment" },
              { label: "Lugar del Documento", name: "documentPlace" },
              { label: "Etnia", name: "ethnicity" },
              { label: "Email personal *", name: "personalEmail" },
              { label: "Email institucional *", name: "institutionalEmail" },
              { label: "Teléfono Móvil", name: "mobilePhone" },
              { label: "Teléfono Fijo", name: "landlinePhone" },
              { label: "Fecha de nacimiento *", name: "birthDate", type: "date" },
              { label: "Nacionalidad *", name: "nationality" },
            ].map(({ label, name, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  type={type || "text"}
                  InputLabelProps={type === "date" ? { shrink: true } : {}}
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message || ""}
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
