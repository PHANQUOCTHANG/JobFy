import { type AdminUserFormValues } from "../schemas/user.schema";
import { IUser } from "../types";

export const USER_DEFAULT_VALUES: AdminUserFormValues = {
  fullName: "",
  email: "",
  role: "candidate",
  status: "active",
  password: "",
  avatarUrl: "",
};

export const mapUserToForm = (user?: IUser | null): AdminUserFormValues => {
  if (!user) return USER_DEFAULT_VALUES;

  return {
    fullName: user.fullName || "",
    email: user.email,
    role: user.role,
    status: user.status || "active",
    password: "", // Không bao giờ map password từ DB ngược về form
    avatarUrl: user.avatarUrl || "",
    avatar: user.avatarUrl || null,
  };
};
