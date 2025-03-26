import { API_BASE_URL } from "../../config";
import { Inscription } from "./InscriptionsList.types";

export const fetchInscriptions = async (): Promise<Inscription[]> => {
  const response = await fetch(`${API_BASE_URL}/inscriptions`);
  if (!response.ok) throw new Error("Error al obtener las inscripciones");
  return response.json();
};

export const deleteInscription = async (userId: string, courseId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/inscriptions`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, courseId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar la inscripción");
  }
};