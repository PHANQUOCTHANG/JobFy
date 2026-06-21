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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // PREVIEW LOGIC CHO AVATAR ---
  const avatarValue = watch("avatar");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Tự động tạo URL preview và dọn dẹp bộ nhớ (Tránh memory leak)
  useEffect(() => {
    if (avatarValue instanceof File) {
      const url = URL.createObjectURL(avatarValue);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url); // Cleanup khi component unmount hoặc chọn file mới
    } else if (typeof avatarValue === "string" && avatarValue !== "") {
      setAvatarPreview(avatarValue); // Nếu là URL từ DB
    } else {
      setAvatarPreview(null);
    }
  }, [avatarValue]);

  // Hàm helper để handle file input (dùng ở UI)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate dung lượng nhanh trên frontend (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
        return;
      }
      setValue("avatar", file, { shouldValidate: true, shouldDirty: true });
    }
  };

  // SUBMIT LOGIC ---
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
