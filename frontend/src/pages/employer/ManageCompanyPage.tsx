import React from "react";
import { ManageCompanyForm } from "@/features/companies/components/ManageCompanyForm";
import { useMyCompany } from "@/features/companies/hooks/useManageCompany";
import { Loader2 } from "lucide-react";

const ManageCompanyPage = () => {
  const { data: company, isLoading, error } = useMyCompany();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ công ty</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin công ty để thu hút ứng viên.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-[#1A56DB]" />
          <span className="ml-3 text-slate-500 font-medium">Đang tải thông tin công ty...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
          <p className="font-semibold">Đã xảy ra lỗi</p>
          <p className="text-sm mt-1">Không thể tải thông tin công ty của bạn. Vui lòng thử lại sau.</p>
        </div>
      ) : (
        <ManageCompanyForm initialData={company} />
      )}
    </div>
  );
};

export default ManageCompanyPage;
