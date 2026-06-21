import { useState } from "react";
import {
  Plus,
  ShieldAlert,
  Users as UsersIcon,
  MoreHorizontal,
  Lock,
  Unlock,
  PenSquare,
  Trash2,
} from "lucide-react";
import { APP_CONFIG } from "@/config/constants";
import { cn } from "@/lib/utils";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/utils/pagination";
import Result from "@/components/ui/Result";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";

// --- Feature Components ---
import { UserFilters } from "@/features/user/components/UserFilters";
import UserModal from "@/features/user/components/UserModal";

// --- Hooks Mới ---
import { useUserParams } from "@/features/user/hooks/useUserParams";
import { useUsersQuery } from "@/features/user/hooks/useUsersQuery";
import { useUserMutations } from "@/features/user/hooks/useUserMutations";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedLoader } from "@/components/ui/ThemedLoader";
import { IUser } from "@/features/user";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";

const UsersManagementPage = () => {
  // --- 1. STATE MANAGEMENT (URL) ---
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = useUserParams(APP_CONFIG.PAGINATION_LIMIT);

  // --- 2. DATA FETCHING ---
  const { data, isLoading, isError, refetch } = useUsersQuery(filterParams);
  // --- 3. MUTATIONS ---
  const {
    createUserAsync,
    updateUserAsync,
    updateUserStatus,
    deleteUser,
    isMutating,
  } = useUserMutations();

  // --- 4. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const [userToBlock, setUserToBlock] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  // Bóc tách data an toàn
  const userData = data?.users || [];
  const meta = data?.meta || {
    totalPages: 1,
    totalItems: 0,
    page: 1,
    limit: APP_CONFIG.PAGINATION_LIMIT,
  };

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: IUser) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  // 🔥 Xử lý Form Submit (Nhận payload JSON từ UserModal)
  const handleFormSubmit = async (payload: any) => {
    try {
      if (userToEdit) {
        await updateUserAsync({ id: userToEdit.id, data: payload });
      } else {
        await createUserAsync(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const handleConfirmBlock = () => {
    if (userToBlock) {
      const newStatus = userToBlock.status === "active" ? "banned" : "active";
      updateUserStatus(
        { id: userToBlock.id, status: newStatus },
        {
          onSuccess: () => setUserToBlock(null),
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

  // --- RENDER HELPERS ---
  const renderRoleBadge = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower === "admin") {
      return (
        <Badge variant="destructive" className="gap-1">
          <ShieldAlert className="size-3" /> Admin
        </Badge>
      );
    }
    if (roleLower === "employer") {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 gap-1 hover:bg-amber-200"
        >
          <UsersIcon className="size-3" /> Employer
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <UsersIcon className="size-3" /> Candidate
      </Badge>
    );
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="rounded-full font-medium shadow-none bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20 dark:text-emerald-400">
            Active
          </Badge>
        );
      case "pending_verification":
        return (
          <Badge variant="outline" className="rounded-full font-medium shadow-none text-amber-600 border-amber-500/30">
            Pending
          </Badge>
        );
      case "banned":
        return (
          <Badge variant="destructive" className="rounded-full font-medium shadow-none">
            Banned
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="rounded-full font-medium shadow-none">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const onBack = useSmartBack();
  const hasResults = userData.length > 0;
  const isFiltering = Boolean(filterParams.search || filterParams.role || filterParams.status);

  const isOffline = !navigator.onLine;

  if (isLoading && hasResults) {
    return <ThemedLoader />;
  }
  if (isError && !hasResults) {
    return (
      <div className="section-container space-y-6 sm:space-y-8 pt-4 pb-4">
        <Result variant="error" onRetry={refetch} />
      </div>
    );
  }
  if (isOffline) {
    return (
      <div className="section-container space-y-6 sm:space-y-8 pt-4 pb-4">
        <Result
          variant="error-network"
          onRetry={refetch}
          onBack={onBack}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* --- HEADER --- */}
      <PageHeader
        title="Users Management"
        subtitle={`Managing ${meta.totalItems} members and their permissions.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/20 font-bold px-6 h-11 rounded-xl transition-all active:scale-[0.98]"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            <Plus className="size-4 mr-2" /> Add User
          </Button>
        }
      />
      <div className="bg-card rounded-2xl shadow-sm">
        {/* --- FILTERS --- */}
        <UserFilters
          params={filterParams}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
        />
      </div>
      {isLoading ? (
        <TableSkeleton
          rows={(meta as any).pageSize || APP_CONFIG.PAGINATION_LIMIT}
          cols={5}
          hasAvatar={true}
        />
      ) : !hasResults ? (
        !isLoading && !isFiltering ? (
          <Result
            variant="empty-genres"
            description="Chưa có người dùng nào"
          />
        ) : (
          <Result
            variant="empty-genres"
            description="Không có kết quả! Thử bộ lọc khác"
            onClearFilters={clearFilters}
            onBack={onBack}
          />
        )
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[300px]">User Info</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Joined Date
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((user: IUser) => (
                <TableRow key={user.id} className="group">
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border">
                          <AvatarImage
                            src={user.avatarUrl || ""}
                            alt={user.fullName || user.email}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {getInitialsTextAvartar(user.fullName || user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground truncate max-w-[150px]">
                            {user.fullName || "No Name"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {renderStatusBadge(user.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-mono">
                      {/* Dummy date since createdAt is not in IUser */}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                            <PenSquare className="mr-2 size-4" /> Edit Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setUserToBlock(user)}
                            className={cn(
                              user.status === "active"
                                ? "text-destructive focus:text-destructive focus:bg-destructive/10"
                                : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10",
                            )}
                          >
                            {user.status === "active" ? (
                              <>
                                <Lock className="mr-2 size-4" /> Block User
                              </>
                            ) : (
                              <>
                                <Unlock className="mr-2 size-4" /> Unblock User
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => setUserToDelete(user)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 size-4" /> Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              ))}
                </TableBody>
          </Table>
        </div>
      )}
      {/* --- PAGINATION --- */}

      {!isLoading && userData.length > 0 && (
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            pageSize={(meta as any).pageSize || APP_CONFIG.PAGINATION_LIMIT}
          />
        </div>
      )}
      {/* ================= MODALS ================= */}

      {/* 1. Create/Edit User Modal */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userToEdit={userToEdit}
          onSubmit={handleFormSubmit}
          isPending={isMutating}
        />
      )}

      {/* 2. Block/Unblock Confirmation */}
      <ConfirmationModal
        isOpen={!!userToBlock}
        onCancel={() => setUserToBlock(null)}
        onConfirm={handleConfirmBlock}
        isLoading={isMutating}
        title={
          userToBlock?.status === "active" ? "Block User Account" : "Restore User Access"
        }
        description={
          userToBlock?.isActive
            ? `Are you sure you want to block ${userToBlock.fullName}? They will immediately be logged out and lose access to the platform.`
            : `Are you sure you want to unblock ${userToBlock?.fullName}? They will regain full access immediately.`
        }
        confirmLabel={userToBlock?.isActive ? "Yes, Block" : "Yes, Unblock"}
        isDestructive={userToBlock?.isActive}
      />

      {/* 3. Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!userToDelete}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isMutating}
        title="Delete User Account?"
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {userToDelete?.fullName || userToDelete?.email}
            </strong>
            ?
            <br />
            <span className="text-destructive font-bold text-sm mt-2 block bg-destructive/10 p-2 rounded border border-destructive/20">
              This action will soft-delete the user from the system.
            </span>
          </span>
        }
        confirmLabel="Yes, Delete User"
        isDestructive
      />
    </div>
  );
};

export default UsersManagementPage;
