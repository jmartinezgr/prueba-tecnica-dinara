export type Inscription = {
  userId: string;
  courseId: string;
};
  
export type ApiError = {
  message: string;
};
  
export type InscriptionState = {
  data: Inscription[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
};