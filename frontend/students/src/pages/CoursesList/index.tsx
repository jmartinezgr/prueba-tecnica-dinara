import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
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
} from "@mui/material";

type Course = {
  id: string;
  name: string;
  professor: string;
  maxSlots: number;
  enrolledStudents: number;
};

const CoursesList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/courses");
        if (!response.ok) throw new Error("Error al obtener los cursos");
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleView = (id: string) => {
    // Navegar a la ruta course/:id
    navigate(`/courses/${id}`);
  };

  const handleEdit = (id:string) => {
    // Navegar a la ruta edit-course/:id
    navigate(`/courses/edit/${id}`);
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el curso");

      // Actualizar la lista de cursos después de eliminar
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
      console.log("Curso eliminado con éxito");
    } catch (err) {
      console.error("Error al eliminar el curso:", (err as Error).message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
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
  );
};

export default CoursesList;