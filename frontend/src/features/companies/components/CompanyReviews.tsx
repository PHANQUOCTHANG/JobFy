import React from 'react';
import { CompanyReview } from '../types';
import { Star, ThumbsUp, ThumbsDown, Lightbulb, UserCheck, UserMinus } from 'lucide-react';
import { format } from 'date-fns';

interface CompanyReviewsProps {
  reviews: CompanyReview[];
  isLoading?: boolean;
}

export const CompanyReviews: React.FC<CompanyReviewsProps> = ({ reviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted/30 rounded-2xl border border-border/40 p-6 animate-pulse">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-16 text-center bg-muted/20 rounded-2xl border border-dashed border-border/60 flex flex-col items-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-muted-foreground/30" />
        </div>
        <h3 className="text-[17px] font-bold text-foreground mb-1.5">Chưa có đánh giá nào</h3>
        <p className="text-muted-foreground text-[14.5px]">Hãy là người đầu tiên chia sẻ trải nghiệm làm việc tại công ty này!</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-muted text-muted-foreground/30'}`}
      />
    ));
  };

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="bg-card rounded-2xl border border-border/40 overflow-hidden hover:border-primary/20 hover:shadow-card transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-5 items-start p-6 border-b border-border/30">
            <div className="flex flex-col items-center justify-center bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-2xl px-6 py-4 min-w-[120px] flex-shrink-0">
              <span className="text-4xl font-black text-foreground leading-none">{review.overallRating}</span>
              <div className="flex mt-2 gap-0.5">
                {renderStars(review.overallRating)}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium mt-1.5 uppercase tracking-wider">Đánh giá</span>
            </div>

            <div className="flex-1">
              <h4 className="text-[17px] font-bold text-foreground mb-2">{review.title || 'Đánh giá công ty'}</h4>
              <div className="flex flex-wrap items-center gap-2.5">
                {review.isCurrentEmployee ? (
                  <div className="flex items-center gap-1.5 bg-success/10 text-success text-[12.5px] font-bold px-2.5 py-1 rounded-full">
                    <UserCheck className="w-3.5 h-3.5" /> Nhân viên hiện tại
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-muted text-muted-foreground text-[12.5px] font-bold px-2.5 py-1 rounded-full">
                    <UserMinus className="w-3.5 h-3.5" /> Cựu nhân viên
                  </div>
                )}
                <span className="text-[12.5px] text-muted-foreground font-medium">
                  {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {review.pros && (
              <div className="flex gap-4 p-4 bg-success/5 border border-success/15 rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/15 flex items-center justify-center mt-0.5">
                  <ThumbsUp className="w-4 h-4 text-success" />
                </div>
                <div>
                  <span className="text-[12.5px] font-black text-success uppercase tracking-wider mb-1.5 block">Điểm tốt (Pros)</span>
                  <p className="text-[14.5px] text-foreground leading-relaxed whitespace-pre-wrap">{review.pros}</p>
                </div>
              </div>
            )}

            {review.cons && (
              <div className="flex gap-4 p-4 bg-destructive/5 border border-destructive/15 rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center mt-0.5">
                  <ThumbsDown className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <span className="text-[12.5px] font-black text-destructive uppercase tracking-wider mb-1.5 block">Cần cải thiện (Cons)</span>
                  <p className="text-[14.5px] text-foreground leading-relaxed whitespace-pre-wrap">{review.cons}</p>
                </div>
              </div>
            )}

            {review.advice && (
              <div className="flex gap-4 p-4 bg-primary/5 border border-primary/15 rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center mt-0.5">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-[12.5px] font-black text-primary uppercase tracking-wider mb-1.5 block">Lời khuyên cho Ban lãnh đạo</span>
                  <p className="text-[14.5px] text-foreground leading-relaxed whitespace-pre-wrap">{review.advice}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
