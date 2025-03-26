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
import { useInscriptionForm, useDialog, useOptions } from "./InscribeStudent.hooks";
import { createInscription } from "./InscribeStudent.service";
import { FormFields } from "./InscribeStudent.types";

const InscribeStudent = () => {
  const { handleSubmit, setValue, formState: { errors } } = useInscriptionForm();
  const { dialog, setDialog, closeDialog } = useDialog();
  const { students, courses, loading, error } = useOptions();

  const onSubmit = async (data: FormFields) => {
    try {
      await createInscription(data);
      setDialog({
        open: true,
        success: true,
        message: "Inscripción realizada con éxito."
      });
    } catch (err) {
      setDialog({
        open: true,
        success: false,
        message: err instanceof Error ? err.message : "Error desconocido"
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ width: "100%", mt: 4, alignItems: "center", justifyContent: "center" }}>
      <h4>Inscribir Estudiante a Curso</h4>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={students}
                loading={loading}
                getOptionLabel={(option) => option.id}
                onChange={(_, value) => setValue("userId", value?.id || "")}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Estudiante *" 
                    error={!!errors.userId} 
                    helperText={errors.userId?.message} 
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={courses}
                loading={loading}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => setValue("courseId", value?.id || "")}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Curso *" 
                    error={!!errors.courseId} 
                    helperText={errors.courseId?.message} 
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={loading}
              >
                {loading ? "Cargando..." : "Inscribir"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={dialog.open} onClose={closeDialog}>
        <DialogTitle>{dialog.success ? "Éxito" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialog.message === "No hay cupo en el curso"
              ? `${dialog.message}. Modifica la capacidad del curso si lo deseas.`
              : dialog.message}
          </DialogContentText>
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

export default InscribeStudent;