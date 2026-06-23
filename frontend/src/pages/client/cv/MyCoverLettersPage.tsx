import React, { useState } from 'react';
import { useCoverLetters, useDeleteCoverLetter } from '@/features/cover-letter/hooks/useCoverLetter';
import { ProfileSidebar } from '../profile/ProfileSidebar';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Trash2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from 'react-router-dom';

export const MyCoverLettersPage: React.FC = () => {
  const { data: response, isLoading } = useCoverLetters();
  const deleteMutation = useDeleteCoverLetter();
  const coverLetters = response?.data?.data || [];

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Đã sao chép nội dung Cover Letter!');
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="bg-[#f4f5f5] min-h-[calc(100vh-64px)] py-8 font-sans">
      <div className="container mx-auto px-4 max-w-[1100px] flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="flex-1 bg-transparent flex flex-col gap-4 min-w-0">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[20px] font-bold text-[#212f3f]">Cover Letter của tôi</h1>
              <Link to="/cv/cover-letter">
                <Button className="bg-[#00b14f] hover:bg-[#009e46] text-white h-9">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tạo mới bằng AI
                </Button>
              </Link>
            </div>
            
            {/* List */}
            {isLoading ? (
              <div className="py-10 text-center text-slate-500 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                Đang tải dữ liệu...
              </div>
            ) : coverLetters.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <FileText className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-[#212f3f] font-medium mb-1">Chưa có Cover Letter nào</p>
                <p className="text-sm">Bạn chưa tạo hoặc lưu Cover Letter nào trên hệ thống.</p>
                <Link to="/cv/cover-letter" className="mt-4">
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    Bắt đầu tạo ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coverLetters.map((letter: any) => (
                  <div key={letter.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-emerald-300 transition-colors flex flex-col h-full group">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-[#212f3f] text-[15px] line-clamp-2" title={letter.title}>
                          {letter.title || 'Cover Letter không tên'}
                        </h3>
                        <p className="text-[12px] text-slate-500 mt-1">
                          Ngày tạo: {format(new Date(letter.createdAt), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                      {letter.isAiGenerated && (
                        <div className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center shrink-0">
                          <Sparkles className="w-3 h-3 mr-1" /> AI
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-1">
                      <div className="text-[13px] text-slate-600 line-clamp-5 leading-relaxed">
                        {letter.content}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="h-8 text-slate-700 hover:text-emerald-700 border-slate-200" onClick={() => handleCopy(letter.content)}>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Copy text
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa Cover Letter?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa vĩnh viễn Cover Letter <strong className="text-[#212f3f]">{letter.title}</strong>? Thao tác này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(letter.id)} className="bg-red-500 hover:bg-red-600 text-white">
                              Xóa ngay
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] shrink-0">
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
};

export default MyCoverLettersPage;
