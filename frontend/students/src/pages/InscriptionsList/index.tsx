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
import { useEffect } from "react";
import { useInscriptions } from "./InscriptionsList.hooks";

const InscriptionsList = () => {
  const { 
    data: inscriptions, 
    loading, 
    error, 
    successMessage,
    loadInscriptions, 
    removeInscription 
  } = useInscriptions();

  useEffect(() => {
    loadInscriptions();
  }, []);

  const handleDelete = async (courseId: string, userId: string) => {
    await removeInscription(userId, courseId);
  };

  if (loading && inscriptions.length === 0) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      <Typography variant="h4" gutterBottom>
        Listado de Inscripciones
      </Typography>
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