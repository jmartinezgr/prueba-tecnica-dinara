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
import { useCourseForm } from "./CourseForm.hooks";
import { createCourse, updateCourse } from "./CourseForm.service";
import { useParams } from "react-router-dom";
import { FormFields } from "./CourseForm.types";

const CourseForm = () => {
  const {
    form,
    isEditMode,
    loading,
    dialog,
    setDialog,
    currentEnrolled,
    navigate
  } = useCourseForm();

  const { register, handleSubmit, formState: { errors } } = form;
  const { id } = useParams();

  const onSubmit = async (data: FormFields) => {
    try {
      if (isEditMode && id) {
        await updateCourse(id, {
          ...data,
          enrolledStudents: currentEnrolled
        });
        setDialog({ 
          open: true, 
          success: true, 
          message: "El curso ha sido actualizado con éxito." 
        });
      } else {
        await createCourse(data);
        setDialog({ 
          open: true, 
          success: true, 
          message: "El curso ha sido creado con éxito." 
        });
        form.reset();
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
            {/* Campos del formulario */}
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

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEditMode ? "Actualizar Curso" : "Crear Curso"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Diálogo de feedback */}
      <Dialog 
        open={dialog.open} 
        onClose={() => setDialog({ ...dialog, open: false })}
      >
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