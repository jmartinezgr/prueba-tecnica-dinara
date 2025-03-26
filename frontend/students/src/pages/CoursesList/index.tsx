import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useCourses } from './CoursesList.hooks';

const CoursesList = () => {
  const { courses, loading, error, removeCourse } = useCourses();
  const navigate = useNavigate();

  const handleView = (id: string) => navigate(`/courses/${id}`);
  const handleEdit = (id: string) => navigate(`/courses/edit/${id}`);
  const handleDelete = (id: string) => removeCourse(id);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <Typography variant="h4" gutterBottom>
      Listado de cursos
    </Typography>
    <TableContainer component={Paper} sx={{ width: "100%", flexGrow: 1 }}>
      <Table sx={{ minWidth: "100%", tableLayout: "fixed" }} aria-label="courses table">
      <TableHead> 
        <TableRow> 
          <TableCell>ID del Curso</TableCell> 
          <TableCell>Nombre del Curso</TableCell> 
          <TableCell>Profesor</TableCell> 
          <TableCell>Cupos Máximos</TableCell> 
          <TableCell>Estudiantes Inscritos</TableCell> 
          <TableCell>Editar</TableCell> 
          <TableCell>Ver Más</TableCell> 
          <TableCell>Eliminar</TableCell> 
        </TableRow> 
      </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.id}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.professor}</TableCell>
              <TableCell>{course.maxSlots}</TableCell>
              <TableCell>{course.enrolledStudents}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handleEdit(course.id)}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleView(course.id)}
                  sx={{ mr: 1 }}
                >
                  Ver más
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(course.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default CoursesList;