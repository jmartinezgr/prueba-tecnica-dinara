import React, { useEffect, useState } from "react";
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

const StudentsList = () => {
  const [students, setStudents] = useState<{ id: string; firstName: string; lastName: string,institutionalEmail: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/students");
        if (!response.ok) throw new Error("Error al obtener los estudiantes");
        const data = await response.json();
        console.log(data);
        setStudents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleView = (id: string) => {
    console.log("Ver información de", id);
  };

  const handleDelete = (id: string) => {
    console.log("Eliminar estudiante", id);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
      <TableContainer component={Paper} sx={{ width: "100%", flexGrow: 1 }}>
        <Table sx={{ minWidth: "100%", tableLayout: "fixed" }} aria-label="students table">
        <TableHead>
          <TableRow>
            <TableCell>Cédula</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>institutionalEmail</TableCell>
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
  );
};

export default StudentsList;
