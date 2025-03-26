import { useState } from "react";
import { InscriptionState } from "./InscriptionsList.types";
import { fetchInscriptions, deleteInscription } from "./InscriptionsList.service";

export const useInscriptions = (initialState: InscriptionState = {
  data: [],
  loading: true,
  error: null,
  successMessage: null
}) => {
  const [state, setState] = useState<InscriptionState>(initialState);

  const loadInscriptions = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await fetchInscriptions();
      setState({ data, loading: false, error: null, successMessage: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      }));
    }
  };

const removeInscription = async (userId: string, courseId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteInscription(userId, courseId);
      setState(prev => ({
        data: prev.data.filter(ins => ins.courseId !== courseId || ins.userId !== userId),
        loading: false,
        error: null,
        successMessage: "Inscripción eliminada correctamente"
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error al eliminar"
      }));
    }
  };

  return { ...state, loadInscriptions, removeInscription };
};