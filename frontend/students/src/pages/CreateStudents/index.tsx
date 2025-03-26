import { Grid, Container, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { TextField, Button, MenuItem } from "@mui/material";
import { useCreateStudentForm } from "./CreateStudent.hooks";
import { useDialog } from "./CreateStudent.hooks";
import { LABELS } from "./CreateStudent.constants";
import { createStudent } from "./CreateStudent.service";
import { FormFields } from "./CreateStudent.types";

const CreateStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useCreateStudentForm();

  const { dialog, setDialog, closeDialog } = useDialog();

  const onSubmit = async (data: FormFields) => {
    try {
      await createStudent(data);
      setDialog({
        open: true,
        success: true,
        message: "El estudiante ha sido creado con éxito."
      });
      reset();
    } catch (error) {
      setDialog({
        open: true,
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido"
      });
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

      <Dialog open={dialog.open} onClose={closeDialog}>
        <DialogTitle>{dialog.success ? "Éxito" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateStudent;