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
  documentDepartment?: string;
  documentPlace?: string;
  gender: "Masculino" | "Femenino" | "Otro";
  ethnicity?: string;
  personalEmail: string;
  institutionalEmail: string;
  mobilePhone?: string;
  landlinePhone?: string;
  birthDate: string;
  nationality: string;
};

type CourseDetails = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  enrolledStudents: number;
  maxSlots: number;
  professor: string;
};

type Course = {
  courseId: string;
  userId: string;
  courseDetails: CourseDetails;
};

const StudentInfo = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID del estudiante de la URL
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Obtener información del estudiante
        const studentResponse = await fetch(`http://localhost:3000/api/students/${id}`);
        if (!studentResponse.ok) throw new Error("Error al obtener la información del estudiante");
        const studentData = await studentResponse.json();
        setStudent(studentData);

        // Obtener cursos inscritos
        const coursesResponse = await fetch(`http://localhost:3000/api/inscriptions/?userId=${id}`);
        console.log(coursesResponse);
        if (!coursesResponse.ok) throw new Error("Error al obtener los cursos inscritos");
        const coursesData = await coursesResponse.json();
        console.log(coursesData);
        setCourses(coursesData);

        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleDeleteInscription = async (courseId: string, userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/inscriptions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, userId }),
      });

      if (!response.ok) throw new Error("Error al eliminar la inscripción");

      // Actualizar la lista de cursos después de eliminar
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseId || course.userId !== userId),
      );

      console.log("Inscripción eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la inscripción:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!student) return <Typography>No se encontró información del estudiante.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Información del Estudiante
      </Typography>

      {/* Información del estudiante */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Nombre: {student.firstName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Apellido: {student.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Cédula: {student.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Género: {student.gender}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Email personal: {student.personalEmail}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              Email institucional: {student.institutionalEmail}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Teléfono móvil: {student.mobilePhone || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Teléfono fijo: {student.landlinePhone || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Fecha de nacimiento: {student.birthDate}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Nacionalidad: {student.nationality}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              Departamento del documento: {student.documentDepartment || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              Lugar del documento: {student.documentPlace || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Etnia: {student.ethnicity || "N/A"}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Cursos inscritos */}
      <Typography variant="h5" gutterBottom>
        Cursos Inscritos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre del Curso</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell>{course.courseId}</TableCell>
                  <TableCell>{course.courseDetails.name}</TableCell>
                  <TableCell>{course.courseDetails.professor}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteInscription(course.courseId, course.userId)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay cursos inscritos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentInfo;