import { useEffect, useState } from "react";
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

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  institutionalEmail: string;
};

type CourseDetails = {
  id: string;
  name: string;
  professor: string;
  maxSlots: number;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
};

type Inscription = {
  courseId: string;
  userId: string;
};

const CourseInfo = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID del curso de la URL
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Obtener información del curso
        const courseResponse = await fetch(`http://localhost:3000/api/courses/${id}`);
        if (!courseResponse.ok) throw new Error("Error al obtener la información del curso");
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Obtener estudiantes inscritos en el curso
        const inscriptionsResponse = await fetch(`http://localhost:3000/api/inscriptions/?courseId=${id}`);
        if (!inscriptionsResponse.ok) throw new Error("Error al obtener los estudiantes inscritos");
        const inscriptionsData: Inscription[] = await inscriptionsResponse.json();

        // Obtener detalles de los estudiantes inscritos
        const studentsData = await Promise.all(
          inscriptionsData.map(async (inscription) => {
            const studentResponse = await fetch(`http://localhost:3000/api/students/${inscription.userId}`);
            if (!studentResponse.ok) throw new Error("Error al obtener la información del estudiante");
            return studentResponse.json();
          }),
        );

        setStudents(studentsData);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleDeleteInscription = async (courseId: string, userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/inscriptions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId }),
      });

      if (!response.ok) throw new Error("Error al eliminar la inscripción");

      // Actualizar la lista de estudiantes después de eliminar
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== userId));
      console.log("Inscripción eliminada con éxito");
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