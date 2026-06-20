import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Star } from 'lucide-react';
import { Company } from '../types';
import { Link } from 'react-router-dom';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card className="group hover:shadow-brand transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1 bg-card/60 backdrop-blur-md border-border/40">
      <div className="relative h-[110px] bg-muted overflow-hidden">
        {company.coverUrl ? (
          <img 
            src={company.coverUrl} 
            alt={`${company.name} cover`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-brand opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="absolute -bottom-8 left-5 p-1 bg-card rounded-xl shadow-raised border border-border/50 ring-1 ring-primary/10">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={`${company.name} logo`} className="w-[60px] h-[60px] object-contain rounded-lg bg-white" />
          ) : (
            <div className="w-[60px] h-[60px] bg-muted flex items-center justify-center rounded-lg">
              <Building2 className="w-8 h-8 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </div>
      
      <CardHeader className="pt-11 pb-2 px-5">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <Link to={`/companies/${company.slug}`} className="hover:text-primary transition-colors block">
              <h3 className="font-bold text-[17px] leading-tight line-clamp-1 group-hover:text-primary transition-colors">{company.name}</h3>
            </Link>
            {company.shortDescription ? (
              <p className="text-[13px] text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">{company.shortDescription}</p>
            ) : (
              <p className="text-[13px] text-muted-foreground mt-1.5 italic">Chưa có giới thiệu ngắn</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow px-5 pt-1">
        <div className="flex flex-col gap-3 mt-2">
          {company.address && (
            <div className="flex items-center text-[13px] text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-primary/70" />
              <span className="line-clamp-1">{company.address.split(',')[0]}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-1">
            {company.totalJobs > 0 && (
              <Badge variant="secondary" className="font-medium bg-primary/10 text-primary hover:bg-primary/20 border-transparent transition-colors">
                {company.totalJobs} Việc làm
              </Badge>
            )}
            {company.size && (
              <Badge variant="outline" className="font-medium border-border/60 text-muted-foreground bg-muted/30">
                {company.size.replace('_', ' - ').replace('plus', '+')} nhân sự
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 pb-4 px-5 flex justify-between items-center border-t border-border/30 mt-auto bg-muted/10">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-[14px] font-bold text-foreground">{company.avgRating || '5.0'}</span>
          <span className="text-[13px] text-muted-foreground ml-1">({company.totalReviews || 0} đánh giá)</span>
        </div>
        <Link to={`/companies/${company.slug}`} className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300">
          Xem chi tiết →
        </Link>
      </CardFooter>
    </Card>
  );
};
