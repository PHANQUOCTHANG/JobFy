import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase } from 'lucide-react';

interface JobFiltersProps {
  onSearch: (filters: any) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = React.useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword });
  };

  return (
    <div className="bg-card border rounded-xl p-4 md:p-6 shadow-sm mb-8">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Tên công việc, từ khóa, kỹ năng..." 
            className="pl-10 h-12"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="md:w-64 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Select defaultValue="all">
            <SelectTrigger className="pl-10 h-12 bg-background">
              <SelectValue placeholder="Tất cả địa điểm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả địa điểm</SelectItem>
              <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
              <SelectItem value="hn">Hà Nội</SelectItem>
              <SelectItem value="dn">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:w-64 relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Select defaultValue="all">
            <SelectTrigger className="pl-10 h-12 bg-background">
              <SelectValue placeholder="Tất cả ngành nghề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ngành nghề</SelectItem>
              <SelectItem value="it">IT - Phần mềm</SelectItem>
              <SelectItem value="marketing">Marketing / PR</SelectItem>
              <SelectItem value="design">Thiết kế đồ hoạ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="h-12 md:w-32">Tìm việc</Button>
      </form>
    </div>
  );
};
