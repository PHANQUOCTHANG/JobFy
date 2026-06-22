import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Save,
  User as UserIcon,
  Mail,
  Lock,
  Loader2,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Wand2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type User } from "../types";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Hook
import { useUserForm } from "../hooks/useUserForm";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  onSubmit: (data: any) => Promise<void>;
  isPending: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSubmit,
  isPending,
}) => {
  const {
    form,
    handleSubmit,
    isSubmitting: isFormSubmitting,
  } = useUserForm({
    userToEdit,
    isOpen,
    onSubmit,
  });

  const {
    register,
    control,
    // eslint-disable-next-line unused-imports/no-unused-vars
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState(false);

  const isLoading = isPending || isFormSubmitting;
  const avatarUrl = watch("avatarUrl");
  const fullName = watch("fullName");

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("password", password, { shouldValidate: true, shouldDirty: true });
    setShowPassword(true);
  };

  if (!isOpen) return null;

  // Helper Components ---
  const FormLabel = ({
    children,
    required,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <Label className="text-[12px] font-bold uppercase text-foreground/80 tracking-wider mb-2 block">
      {children}{" "}
      {required && <span className="text-destructive text-sm">*</span>}
    </Label>
  );

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1.5 mt-2 text-[12px] font-semibold text-destructive animate-in slide-in-from-left-1 fade-in duration-300">
        <AlertCircle className="size-3.5 shrink-0" />
        <span>{message}</span>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-[101] w-full max-w-2xl bg-card border shadow-2xl flex flex-col max-h-[90vh] rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/10">
        {/* --- HEADER --- */}
        <header className="px-6 py-5 border-b bg-muted/30 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/10">
              <UserIcon className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground leading-tight">
                {userToEdit ? "Chỉnh Sửa Hồ Sơ" : "Tạo Tài Khoản Mới"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "flex size-2 rounded-full",
                    userToEdit ? "bg-blue-500" : "bg-emerald-500 animate-pulse",
                  )}
                />
                <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-widest">
                  {userToEdit
                    ? `User ID: ${userToEdit.id.slice(0, 8)}...`
                    : "Admin Dashboard"}
                </p>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-colors"
          >
            <X className="size-5" />
          </Button>
        </header>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form
            id="user-form"
            onSubmit={handleSubmit}
            className="p-6 space-y-8"
          >
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-primary tracking-wide uppercase border-b pb-2">Thông tin cơ bản</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Full Name */}
                  <div>
                    <FormLabel required>Họ và tên</FormLabel>
                    <Input
                      {...register("fullName")}
                      autoComplete="off"
                      spellCheck="false"
                      className={cn(
                        "h-12 text-base bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl transition-all",
                        errors.fullName && "border-destructive focus-visible:ring-destructive/20 bg-destructive/5",
                      )}
                      placeholder="Nhập họ và tên đầy đủ..."
                    />
                    <ErrorMessage message={errors.fullName?.message} />
                  </div>

                  {/* Email */}
                  <div>
                    <FormLabel required>Email</FormLabel>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="email"
                        {...register("email")}
                        autoComplete="off"
                        className={cn(
                          "pl-11 h-12 text-base rounded-xl bg-background shadow-sm focus-visible:ring-primary/20 transition-all",
                          errors.email && "border-destructive focus-visible:ring-destructive/20 bg-destructive/5",
                        )}
                        placeholder="user@jobfy.com"
                      />
                    </div>
                    {userToEdit && !errors.email && (
                      <p className="text-[11px] text-amber-600 mt-2 font-medium">
                        * Thay đổi email có thể ảnh hưởng đến đăng nhập.
                      </p>
                    )}
                    <ErrorMessage message={errors.email?.message} />
                  </div>
                </div>

                {/* Avatar Preview & URL */}
                <div className="flex flex-col items-center justify-start space-y-4 pt-2">
                  <Avatar className="size-24 border-4 border-background shadow-md">
                    <AvatarImage src={avatarUrl || ""} alt={fullName || "Avatar"} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {getInitialsTextAvartar(fullName || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="relative group">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="url"
                        {...register("avatarUrl")}
                        autoComplete="off"
                        className={cn(
                          "pl-9 h-10 text-sm rounded-lg bg-background shadow-sm",
                          errors.avatarUrl && "border-destructive bg-destructive/5",
                        )}
                        placeholder="https://.../avatar.jpg"
                      />
                    </div>
                    <ErrorMessage message={errors.avatarUrl?.message} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Permissions */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-primary tracking-wide uppercase border-b pb-2">Phân quyền & Trạng thái</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Role */}
                <div>
                  <FormLabel required>Vai trò (Role)</FormLabel>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12 w-full rounded-xl bg-background shadow-sm text-base">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="candidate">Ứng viên (Candidate)</SelectItem>
                          <SelectItem value="employer">Nhà tuyển dụng (Employer)</SelectItem>
                          <SelectItem value="admin" className="text-destructive font-bold">Quản trị viên (Admin)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <ErrorMessage message={errors.role?.message} />
                </div>

                {/* Status */}
                <div>
                  <FormLabel required>Trạng thái tài khoản</FormLabel>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12 w-full rounded-xl bg-background shadow-sm text-base">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active" className="text-emerald-600 font-medium">Hoạt động (Active)</SelectItem>
                          <SelectItem value="pending_verification" className="text-amber-600 font-medium">Chờ xác thực (Pending)</SelectItem>
                          <SelectItem value="inactive" className="text-muted-foreground font-medium">Vô hiệu hóa (Inactive)</SelectItem>
                          <SelectItem value="banned" className="text-destructive font-bold">Bị khóa (Banned)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <ErrorMessage message={errors.status?.message} />
                </div>
              </div>
            </div>

            {/* Section 3: Security */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-primary tracking-wide uppercase border-b pb-2">Bảo mật</h4>
              <div>
                <FormLabel required={!userToEdit}>Mật khẩu truy cập</FormLabel>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("password")}
                      className={cn(
                        "pl-11 pr-10 h-12 text-base rounded-xl bg-background shadow-sm focus-visible:ring-primary/20 transition-all font-mono",
                        errors.password && "border-destructive focus-visible:ring-destructive/20 bg-destructive/5",
                      )}
                      placeholder={userToEdit ? "Bỏ trống nếu giữ nguyên mật khẩu cũ" : "Nhập mật khẩu cho người dùng mới"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGeneratePassword}
                    className="h-12 px-4 rounded-xl gap-2 font-medium shrink-0 shadow-sm"
                    title="Tạo mật khẩu ngẫu nhiên"
                  >
                    <Wand2 className="size-4 text-primary" />
                    <span className="hidden sm:inline">Tạo ngẫu nhiên</span>
                  </Button>
                </div>
                {userToEdit && !errors.password && (
                  <p className="text-[11px] text-muted-foreground mt-2 font-medium">
                    * Nhập mật khẩu mới sẽ vô hiệu hóa ngay lập tức mật khẩu cũ của tài khoản.
                  </p>
                )}
                {!userToEdit && !errors.password && (
                  <p className="text-[11px] text-primary/80 mt-2 font-medium">
                    * Mật khẩu bắt buộc đối với tài khoản mới tạo.
                  </p>
                )}
                <ErrorMessage message={errors.password?.message} />
              </div>
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <footer className="px-6 py-4 border-t bg-muted/30 flex justify-end items-center gap-3 shrink-0 z-20">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-11 px-6 rounded-xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            Hủy Bỏ
          </Button>
          <Button
            form="user-form"
            type="submit"
            disabled={isLoading}
            className="h-11 px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="size-5 mr-2 animate-spin" />
            ) : (
              <Save className="size-5 mr-2" />
            )}
            {userToEdit ? "Lưu Thay Đổi" : "Tạo Tài Khoản"}
          </Button>
        </footer>
      </div>
    </div>,
    document.body,
  );
};

export default UserModal;
