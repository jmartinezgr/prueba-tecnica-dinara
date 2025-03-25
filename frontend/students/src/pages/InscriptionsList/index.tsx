import { useEffect, useState } from "react";
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

// Definir el tipo de inscripción
type Inscription = {
  id: string;
  userId: string;
  courseId: string;
};

const InscriptionsList = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/inscriptions");
        if (!response.ok) throw new Error("Error al obtener las inscripciones");
        const data = await response.json();
        setInscriptions(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/inscriptions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la inscripción");

      setInscriptions((prev) => prev.filter((inscription) => inscription.id !== id));
      console.log("Inscripción eliminada con éxito");
    } catch (err) {
      console.error("Error al eliminar la inscripción:", (err as Error).message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <TableContainer component={Paper} sx={{ width: "100%", flexGrow: 1 }}>
      <Table sx={{ minWidth: "100%", tableLayout: "fixed" }} aria-label="inscriptions table">
        <TableHead>
          <TableRow>
            <TableCell>ID del Usuario</TableCell>
            <TableCell>ID del Curso</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inscriptions.map((inscription) => (
            <TableRow key={inscription.id+inscription.userId}>
              <TableCell>{inscription.userId}</TableCell>
              <TableCell>{inscription.courseId}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(inscription.id)}
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

export default InscriptionsList;
