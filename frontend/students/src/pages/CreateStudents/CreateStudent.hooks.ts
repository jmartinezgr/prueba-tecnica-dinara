import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./CreateStudent.schema";
import { FormFields, DialogState } from "./CreateStudent.types";

export const useCreateStudentForm = () => {
  return useForm<FormFields>({
    resolver: zodResolver(schema),
  });
};

export const useDialog = (initialState: DialogState = {
  open: false,
  success: false,
  message: ""
}) => {
  const [dialog, setDialog] = useState<DialogState>(initialState);

  const closeDialog = () => setDialog(prev => ({ ...prev, open: false }));

  return { dialog, setDialog, closeDialog };
};