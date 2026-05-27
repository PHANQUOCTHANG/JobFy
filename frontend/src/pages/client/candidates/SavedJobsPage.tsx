import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SavedJobsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Việc làm đã lưu</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách các công việc bạn đã quan tâm và lưu lại để ứng tuyển sau.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-12 text-center flex flex-col items-center justify-center">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <Heart className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Bạn chưa lưu công việc nào</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Khám phá hàng ngàn công việc hấp dẫn và lưu lại để không bỏ lỡ cơ hội nghề nghiệp.
        </p>
        <Button asChild>
          <Link to="/jobs">Khám phá Việc làm</Link>
        </Button>
      </div>
    </div>
  );
};

export default SavedJobsPage;
