import { AdminUserFormValues } from "../schemas/user.schema";

export const buildUserPayload = (
  values: AdminUserFormValues,
  dirtyFields: Partial<Record<keyof AdminUserFormValues, boolean | any>>,
  isEditMode: boolean,
): any => {
  const payload: any = {};

  (Object.keys(values) as Array<keyof AdminUserFormValues>).forEach((key) => {
    // Dirty Checking: Chỉ gửi field thay đổi (hoặc gửi hết nếu là create)
    // Đối với password, chỉ gửi nếu có nhập (kể cả tạo mới hay edit)
    if (key === "password" && !values.password) return;

    if (!isEditMode || dirtyFields[key]) {
      payload[key] = values[key];
    }
  });

  return payload;
};
