/**
 * AppResult — Universal Result State System
 * ============================================
 * Một bộ component thống nhất cho mọi trạng thái kết quả trong ứng dụng:
 * Empty, Error, Loading, NoPermission, Offline, SearchEmpty
 *
 * Tất cả màu sắc dùng CSS variables từ global stylesheet.
 */

import React, { memo } from "react";
import {
  FileText,
  Briefcase,
  Building,
  AlertCircle,
  WifiOff,
  SearchX,
  Lock,
  RefreshCw,
  ArrowLeft,
  type LucideIcon,
  X,
  LogInIcon,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — Complete API surface
// ─────────────────────────────────────────────────────────────────────────────

/** Wave CSS variable names từ global stylesheet */
type WaveVar =
  | "--wave-1"
  | "--wave-2"
  | "--wave-3"
  | "--wave-4"
  | "--wave-5"
  | "--wave-6"
  | "--wave-7"
  | "--wave-8"
  | "--wave-9"
  | "--wave-10"
  | "--primary"
  | "--error"
  | "--success"
  | "--warning"
  | "--info";

/** Preset variants — bao gồm mọi use-case phổ biến */
type ResultVariant =
  | "empty" // Danh sách trống
  | "empty-search" // Tìm kiếm không có kết quả
  | "empty-jobs" // Chưa có việc làm
  | "empty-applications" // Chưa có đơn ứng tuyển
  | "empty-companies" // Chưa có công ty
  | "error" // Lỗi chung
  | "error-network" // Mất kết nối
  | "no-permission" // Không có quyền
  | "loading" // Đang tải (skeleton)
  | "custom"; // Tùy chỉnh hoàn toàn

/** Size của container */
type ResultSize = "sm" | "md" | "lg" | "xl";

/** Layout orientation */
type ResultLayout = "vertical" | "horizontal";

interface ActionConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "primary" | "outline" | "ghost";
}

export interface AppResultProps {
  // ── Core ──────────────────────────────────────────────────
  variant?: ResultVariant;

  // ── Display overrides (dùng khi variant="custom") ─────────
  icon?: LucideIcon | React.ReactNode;
  title?: string;
  description?: string;

  // ── Theming ───────────────────────────────────────────────
  /** CSS variable tô màu icon & accent. VD: "--wave-1" */
  wave?: WaveVar;

  // ── Actions ───────────────────────────────────────────────
  /** Primary action (nút chính) */
  action?: ActionConfig;
  /** Secondary action (nút phụ) */
  secondaryAction?: ActionConfig;

  thirdAction?: ActionConfig;
  fourthAction?: ActionConfig;

  // ── Callbacks tiện lợi ────────────────────────────────────
  onRetry?: () => void;
  onBack?: () => void;
  onClearFilters?: () => void;
  onNavigate?: () => void;
  // ── Context ───────────────────────────────────────────────
  /** Từ khóa tìm kiếm — hiển thị trong empty-search */
  searchQuery?: string;

  // ── Layout ────────────────────────────────────────────────
  size?: ResultSize;
  layout?: ResultLayout;
  className?: string;

  // ── A11y ──────────────────────────────────────────────────
  role?: "status" | "alert" | "none";
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESET DEFINITIONS — Tất cả nội dung mặc định theo variant
// ─────────────────────────────────────────────────────────────────────────────

interface PresetConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  wave: WaveVar;
  borderStyle: "dashed" | "solid";
  role: "status" | "alert";
}

const PRESETS: Record<
  Exclude<ResultVariant, "custom" | "loading">,
  PresetConfig
> = {
  empty: {
    icon: Inbox,
    title: "Chưa có nội dung",
    description: "Danh sách này hiện đang trống.",
    wave: "--primary",
    borderStyle: "dashed",
    role: "status",
  },
  "empty-search": {
    icon: SearchX,
    title: "Không tìm thấy kết quả",
    description: "Thử từ khóa khác hoặc điều chỉnh bộ lọc.",
    wave: "--primary",
    borderStyle: "dashed",
    role: "status",
  },
  "empty-jobs": {
    icon: Briefcase,
    title: "Chưa có việc làm",
    description: "Hiện tại chưa có công việc nào khả dụng.",
    wave: "--primary",
    borderStyle: "dashed",
    role: "status",
  },
  "empty-applications": {
    icon: FileText,
    title: "Chưa có hồ sơ ứng tuyển",
    description: "Bạn chưa nộp hồ sơ ứng tuyển nào.",
    wave: "--primary",
    borderStyle: "dashed",
    role: "status",
  },
  "empty-companies": {
    icon: Building,
    title: "Chưa có công ty",
    description: "Danh sách công ty hiện đang trống.",
    wave: "--primary",
    borderStyle: "dashed",
    role: "status",
  },
  error: {
    icon: AlertCircle,
    title: "Đã có lỗi xảy ra",
    description: "Không thể tải dữ liệu. Vui lòng thử lại.",
    wave: "--error",
    borderStyle: "solid",
    role: "alert",
  },
  "error-network": {
    icon: WifiOff,
    title: "Mất kết nối mạng",
    description: "Kiểm tra kết nối internet và thử lại.",
    wave: "--warning",
    borderStyle: "solid",
    role: "alert",
  },
  "no-permission": {
    icon: Lock,
    title: "Không có quyền truy cập",
    description: "Bạn không có quyền xem nội dung này.",
    wave: "--wave-9",
    borderStyle: "solid",
    role: "alert",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SIZE MAP
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<
  ResultSize,
  {
    container: string;
    iconWrap: string;
    iconSize: string;
    title: string;
    desc: string;
  }
> = {
  sm: {
    container: "py-8 px-4 gap-2.5",
    iconWrap: "size-10",
    iconSize: "size-4",
    title: "text-sm font-semibold",
    desc: "text-xs",
  },
  md: {
    container: "py-12 px-6 gap-3",
    iconWrap: "size-12",
    iconSize: "size-5",
    title: "text-sm font-semibold",
    desc: "text-xs",
  },
  lg: {
    container: "py-16 px-8 gap-4",
    iconWrap: "size-16",
    iconSize: "size-6",
    title: "text-base font-semibold",
    desc: "text-sm",
  },
  xl: {
    container: "py-20 px-10 gap-5",
    iconWrap: "size-20",
    iconSize: "size-7",
    title: "text-lg font-semibold",
    desc: "text-sm",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Single action button */
const ActionButton = memo(({ action }: { action: ActionConfig }) => {
  const Icon = action.icon;
  const variantClass =
    action.variant === "primary"
      ? "btn-primary btn-sm"
      : action.variant === "ghost"
        ? "btn-ghost btn-sm"
        : "btn-outline btn-sm";

  return (
    <button
      type="button"
      onClick={action.onClick}
      className={cn("flex items-center gap-1.5 mt-1", variantClass)}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {action.label}
    </button>
  );
});
ActionButton.displayName = "ActionButton";

/** Loading skeleton — khớp với kích thước AppResult */
const LoadingSkeleton = memo(
  ({ size, className }: { size: ResultSize; className?: string }) => {
    const s = SIZE_MAP[size];
    return (
      <div
        role="status"
        aria-label="Đang tải..."
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-border/40",
          s.container,
          className,
        )}
      >
        <div className={cn("skeleton skeleton-avatar", s.iconWrap)} />
        <div className="space-y-2 w-full max-w-[180px]">
          <div className="skeleton skeleton-text w-3/4 mx-auto" />
          <div className="skeleton skeleton-text w-full" />
          <div className="skeleton skeleton-text w-2/3 mx-auto" />
        </div>
      </div>
    );
  },
);
LoadingSkeleton.displayName = "LoadingSkeleton";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AppResult = memo(
  ({
    variant = "empty",
    icon: customIcon,
    title: customTitle,
    description: customDescription,
    wave: customWave,
    action,
    secondaryAction,
    thirdAction,
    fourthAction,
    onRetry,
    onBack,
    onClearFilters,
    onNavigate,
    searchQuery,
    size = "md",
    layout = "vertical",
    className,
    role: customRole,
  }: AppResultProps) => {
    // ── Loading variant ─────────────────────────────────────────────────────
    if (variant === "loading") {
      return <LoadingSkeleton size={size} className={className} />;
    }

    // ── Resolve preset hoặc custom ──────────────────────────────────────────
    const preset = variant !== "custom" ? PRESETS[variant] : null;

    const wave = customWave ?? preset?.wave ?? "--primary";
    const title = customTitle ?? preset?.title ?? "Chưa có nội dung";
    const borderStyle = preset?.borderStyle ?? "dashed";
    const ariaRole = customRole ?? preset?.role ?? "status";

    // Description — handle searchQuery interpolation for empty-search
    let description = customDescription ?? preset?.description ?? "";
    if (variant === "empty-search" && searchQuery && !customDescription) {
      description = `Không tìm thấy kết quả cho "${searchQuery}".`;
    }

    // ── Resolve icon ────────────────────────────────────────────────────────
    const s = SIZE_MAP[size];
    let iconNode: React.ReactNode;

    if (customIcon) {
      // KIỂM TRA: Nếu customIcon là một Function (Component), ta render nó
      if (
        typeof customIcon === "function" ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (typeof customIcon === "object" && (customIcon as any).$$typeof)
      ) {
        const IconComp = customIcon as LucideIcon;
        iconNode = <IconComp className={s.iconSize} aria-hidden="true" />;
      } else {
        // Nếu nó đã là một ReactNode (vd: <img /> hoặc <span>)
        iconNode = customIcon as React.ReactNode;
      }
    } else {
      // Dùng preset icon
      const IconComp = (preset?.icon ?? Inbox) as LucideIcon;
      iconNode = <IconComp className={s.iconSize} aria-hidden="true" />;
    }

    // ── Auto-inject onRetry → action ────────────────────────────────────────
    const resolvedAction: ActionConfig | undefined =
      action ??
      (onRetry
        ? {
            label: "Thử lại",
            icon: RefreshCw,
            onClick: onRetry,
            variant: "outline",
          }
        : undefined);

    const resolvedSecondaryAction: ActionConfig | undefined =
      secondaryAction ??
      (onBack
        ? {
            label: "Quay lại",
            icon: ArrowLeft,
            onClick: onBack,
            variant: "ghost",
          }
        : undefined);
    const resolvedThirdAction: ActionConfig | undefined =
      thirdAction ??
      (onClearFilters
        ? {
            label: "Xóa bộ lọc",
            icon: X,
            onClick: onClearFilters,
            variant: "ghost",
          }
        : undefined);
    const resolvedfourthAction: ActionConfig | undefined =
      fourthAction ??
      (onNavigate
        ? {
            label: "",
            icon: LogInIcon,
            onClick: onNavigate,
            variant: "ghost",
          }
        : undefined);

    // ── Error/warning variants: solid background tint ───────────────────────
    const isErrorLike =
      variant === "error" ||
      variant === "error-network" ||
      variant === "no-permission";

    // ── Layout classes ──────────────────────────────────────────────────────
    const isHorizontal = layout === "horizontal";

    return (
      <div
        role={ariaRole === "none" ? undefined : ariaRole}
        aria-label={title}
        className={cn(
          "flex items-center justify-center text-center rounded-2xl border transition-colors",
          // Layout
          isHorizontal ? "flex-row gap-4 text-left" : "flex-col",
          s.container,
          // Border style
          borderStyle === "dashed"
            ? "border-dashed border-border"
            : "border-solid",
          className,
        )}
        style={
          isErrorLike
            ? {
                background: `hsl(var(${wave}) / 0.05)`,
                borderColor: `hsl(var(${wave}) / 0.20)`,
              }
            : undefined
        }
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full shrink-0 transition-colors",
            s.iconWrap,
          )}
          style={{
            background: `hsl(var(${wave}) / 0.10)`,
            color: `hsl(var(${wave}))`,
          }}
        >
          {iconNode}
        </div>

        <div className={cn("space-y-1", isHorizontal ? "flex-1 min-w-0" : "")}>
          <p className={cn("text-foreground", s.title)}>{title}</p>
          {description && (
            <p className={cn("text-muted-foreground leading-relaxed", s.desc)}>
              {description}
            </p>
          )}

          {(resolvedAction ||
            resolvedSecondaryAction ||
            resolvedThirdAction ||
            resolvedfourthAction) && (
            <div
              className={cn(
                "flex flex-wrap gap-2 mt-2",
                isHorizontal ? "justify-start" : "justify-center",
              )}
            >
              {resolvedAction && <ActionButton action={resolvedAction} />}
              {resolvedSecondaryAction && (
                <ActionButton action={resolvedSecondaryAction} />
              )}
              {resolvedThirdAction && (
                <ActionButton action={resolvedThirdAction} />
              )}
              {resolvedfourthAction && (
                <ActionButton action={resolvedfourthAction} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
AppResult.displayName = "AppResult";

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE WRAPPERS — Drop-in replacements cho EmptyState & ErrorState cũ
// ─────────────────────────────────────────────────────────────────────────────

/** Backward-compatible: thay thế EmptyState cũ */
export const EmptyState = memo(
  (
    props: Omit<AppResultProps, "variant"> & {
      variant?: Extract<
        ResultVariant,
        | "empty"
        | "empty-jobs"
        | "empty-applications"
        | "empty-companies"
        | "empty-search"
      >;
    },
  ) => <AppResult {...props} variant={props.variant ?? "empty"} />,
);
EmptyState.displayName = "EmptyState";

/** Backward-compatible: thay thế ErrorState cũ */
export const ErrorState = memo(
  (
    props: Omit<AppResultProps, "variant"> & {
      variant?: Extract<
        ResultVariant,
        "error" | "error-network" | "no-permission"
      >;
    },
  ) => <AppResult {...props} variant={props.variant ?? "error"} />,
);
ErrorState.displayName = "ErrorState";

/** Convenience: loading skeleton */
export const LoadingState = memo(
  (props: Pick<AppResultProps, "size" | "className">) => (
    <AppResult variant="loading" {...props} />
  ),
);
LoadingState.displayName = "LoadingState";

export default AppResult;
