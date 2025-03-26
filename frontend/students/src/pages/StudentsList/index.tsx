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
  Alert,
  Typography,
} from "@mui/material";
import { useStudentsList } from "./StudentsList.hooks";

const StudentsList = () => {
  const { data: students, loading, error, removeStudent } = useStudentsList();
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/students/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeStudent(id);
    } catch {
      // El error ya se maneja en el hook
    }
  };

  if (loading) return <CircularProgress />;
  if (error) {
    console.log(error);
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Listado de Estudiantes
      </Typography>
    <TableContainer component={Paper} sx={{ width: "100%", flexGrow: 1 }}>
      <Table sx={{ minWidth: "100%", tableLayout: "fixed" }} aria-label="students table">
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
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.lastName}</TableCell>
              <TableCell>{student.institutionalEmail}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleView(student.id)}
                  sx={{ mr: 1 }}
                >
                  Ver más
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(student.id)}
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

export default StudentsList;