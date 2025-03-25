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
  Alert,
} from "@mui/material";

// Definir el tipo de inscripción
type Inscription = {
  userId: string;
  courseId: string;
};

const InscriptionsList = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleDelete = async (courseId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`http://localhost:3000/api/inscriptions`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la inscripción");
      }

      // Filtrar usando ambos IDs de la clave compuesta
      setInscriptions(prev => 
        prev.filter(ins => ins.courseId !== courseId || ins.userId !== userId)
      );

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
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
              <TableRow key={`${inscription.courseId}-${inscription.userId}`}>
                <TableCell>{inscription.userId}</TableCell>
                <TableCell>{inscription.courseId}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(inscription.courseId, inscription.userId)}
                    disabled={loading}
                  >
                    {loading ? "Eliminando..." : "Eliminar"}
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

export default InscriptionsList;