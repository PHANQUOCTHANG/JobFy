import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createAdminUserSchema,
  updateAdminUserSchema,
  type AdminUserFormValues,
} from "../schemas/user.schema";
import { mapUserToForm } from "../utils/formMapper";
import { buildUserPayload } from "../utils/payloadBuilder";
import { IUser } from "../types";

interface UseUserFormProps {
  userToEdit?: IUser | null;
  isOpen: boolean; // Dùng để trigger reset form mỗi khi mở Modal
  onSubmit: (payload: any) => Promise<void>; // Inject mutation function vào đây
}

export const useUserForm = ({
  userToEdit,
  isOpen,
  onSubmit,
}: UseUserFormProps) => {
  // 1. Tính toán giá trị mặc định (Chỉ chạy lại khi userToEdit thay đổi)
  const defaultValues = useMemo(() => {
    return mapUserToForm(userToEdit);
  }, [userToEdit]);

  // Schema linh động: Tạo mới thì bắt buộc có password, Edit thì không bắt buộc
  const currentSchema = useMemo(() => {
    return userToEdit ? updateAdminUserSchema : createAdminUserSchema;
  }, [userToEdit]);

  // 2. Khởi tạo React Hook Form
  const form = useForm<AdminUserFormValues>({
    resolver: zodResolver(currentSchema) as any,
    defaultValues,
    mode: "onSubmit", // Chỉ hiện lỗi khi bấm submit
  });

  const { reset, formState } = form;
  const { dirtyFields, isSubmitting } = formState;

  // 3. Reset Form khi Modal mở hoặc khi đổi User đang edit
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);


  // --- SUBMIT LOGIC ---
  const handleSubmit = form.handleSubmit(async (values) => {
    const isEditMode = !!userToEdit;

    // DIRTY CHECKING (Tối ưu hóa băng thông)
    const hasChanges = Object.keys(dirtyFields).length > 0;

    if (isEditMode && !hasChanges && !values.password) {
      toast.info("Không có thay đổi nào để cập nhật.");
      return;
    }

    try {
      // Build Payload thông minh: Chỉ chứa các field bị thay đổi (dirtyFields)
      const payload = buildUserPayload(values, dirtyFields, isEditMode);

      // Gọi API thông qua function được truyền từ Component cha
      await onSubmit(payload);
    } catch (error) {
      console.error("User form submission error:", error);
    }
  });

  return {
    form,
    handleSubmit,

    // States cho UI
    isSubmitting,
    isDirty: formState.isDirty,
  };
};
