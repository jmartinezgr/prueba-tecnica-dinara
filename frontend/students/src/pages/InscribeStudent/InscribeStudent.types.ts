export type FormFields = {
    userId: string;
    courseId: string;
};
  
export type Option = {
    id: string;
    name: string;
};
  
export type DialogState = {
    open: boolean;
    success: boolean;
    message: string;
};