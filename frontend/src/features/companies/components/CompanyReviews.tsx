import React from 'react';
import { CompanyReview } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

interface CompanyReviewsProps {
  reviews: CompanyReview[];
  isLoading?: boolean;
}

export const CompanyReviews: React.FC<CompanyReviewsProps> = ({ reviews, isLoading }) => {
  if (isLoading) {
    return <div className="text-muted-foreground">Đang tải đánh giá...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-8 text-center bg-muted/30 rounded-xl border border-dashed">
        <p className="text-muted-foreground">Chưa có đánh giá nào cho công ty này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Rating Summary */}
              <div className="md:w-1/4 flex flex-col items-center md:items-start md:border-r pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold">{review.overallRating}</span>
                </div>
                {review.isCurrentEmployee ? (
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Nhân viên hiện tại</span>
                ) : (
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Cựu nhân viên</span>
                )}
                <span className="text-xs text-muted-foreground mt-2">
                  {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
              
              {/* Review Content */}
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold mb-2">{review.title || 'Đánh giá công ty'}</h4>
                
                {review.pros && (
                  <div className="mb-3">
                    <span className="font-medium text-green-600 flex items-center gap-2">
                      <span className="text-lg">+</span> Ưu điểm:
                    </span>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{review.pros}</p>
                  </div>
                )}
                
                {review.cons && (
                  <div className="mb-3">
                    <span className="font-medium text-red-600 flex items-center gap-2">
                      <span className="text-lg">-</span> Nhược điểm:
                    </span>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{review.cons}</p>
                  </div>
                )}
                
                {review.advice && (
                  <div>
                    <span className="font-medium text-blue-600 flex items-center gap-2">
                      <span className="text-lg">💡</span> Lời khuyên:
                    </span>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{review.advice}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
