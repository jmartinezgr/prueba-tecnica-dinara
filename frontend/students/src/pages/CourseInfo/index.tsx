import { useParams } from "react-router-dom";
import {
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useCourseData } from './CourseInfo.hooks';
import { deleteInscription } from './CourseInfo.service';

const CourseInfo = () => {
  const { id } = useParams<{ id: string }>();
  const { course, students, loading,setStudents, error } = useCourseData(id || '');

  const handleDeleteInscription = async (courseId: string, userId: string) => {
    try {
      await deleteInscription(userId, courseId);
      setStudents(prev => prev.filter(student => student.id !== userId));
    } catch (error) {
      console.error("Error al eliminar la inscripción:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!course) return <Typography>No se encontró información del curso.</Typography>;


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Información del Curso
      </Typography>

      {/* Información del curso */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">ID del Curso: {course.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Nombre del Curso: {course.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Profesor: {course.professor}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Cupos Máximos: {course.maxSlots}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Estudiantes Inscritos: {course.enrolledStudents}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Fecha de Creación: {new Date(course.createdAt).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Última Actualización: {new Date(course.updatedAt).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Estudiantes inscritos */}
      <Typography variant="h5" gutterBottom>
        Estudiantes Inscritos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cédula</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email Institucional</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.institutionalEmail}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteInscription(course.id, student.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay estudiantes inscritos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseInfo;