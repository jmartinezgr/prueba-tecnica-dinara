export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    institutionalEmail: string;
};
  
export type CourseDetails = {
    id: string;
    name: string;
    professor: string;
    maxSlots: number;
    enrolledStudents: number;
    createdAt: string;
    updatedAt: string;
};
  
export type Inscription = {
    courseId: string;
    userId: string;
};