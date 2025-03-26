export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    institutionalEmail: string;
  };
  
  export type StudentsListState = {
    data: Student[];
    loading: boolean;
    error: string | null;
  };