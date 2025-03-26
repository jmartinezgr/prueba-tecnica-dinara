export type Student = {
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
  
  export type CourseDetails = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    enrolledStudents: number;
    maxSlots: number;
    professor: string;
  };
  
  export type Course = {
    courseId: string;
    userId: string;
    courseDetails: CourseDetails;
  };
  
  export type StudentInfoState = {
    student: Student | null;
    courses: Course[];
    loading: boolean;
    error: string | null;
  };