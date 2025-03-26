export type FormFields = {
    id: string;
    firstName: string;
    lastName: string;
    documentDepartment?: string;
    documentPlace?: string;
    gender: "Masculino" | "Femenino" | "Otro";
    ethnicity?: string;
    personalEmail: string;
    institutionalEmail: string;
    mobilePhone?: string;
    landlinePhone?: string;
    birthDate: string;
    nationality: string;
  };
  
  export type DialogState = {
    open: boolean;
    success: boolean;
    message: string;
  };
  
  export type FormLabel = {
    label: string;
    name: keyof FormFields;
    type?: string;
  };