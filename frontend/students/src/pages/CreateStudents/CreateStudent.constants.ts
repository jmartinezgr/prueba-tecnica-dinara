import { FormLabel } from "./CreateStudent.types";

export const LABELS: FormLabel[] = [
  { label: "ID *", name: "id" },
  { label: "Nombre *", name: "firstName" },
  { label: "Apellido *", name: "lastName" },
  { label: "Departamento del Documento", name: "documentDepartment" },
  { label: "Lugar del Documento", name: "documentPlace" },
  { label: "Etnia", name: "ethnicity" },
  { label: "Email personal *", name: "personalEmail" },
  { label: "Email institucional *", name: "institutionalEmail" },
  { label: "Teléfono Móvil", name: "mobilePhone" },
  { label: "Teléfono Fijo", name: "landlinePhone" },
  { label: "Fecha de nacimiento *", name: "birthDate", type: "date" },
  { label: "Nacionalidad *", name: "nationality" },
];