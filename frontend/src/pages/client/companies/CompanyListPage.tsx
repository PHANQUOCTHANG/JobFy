import React, { useState } from 'react';
import { useCompanies, CompanyList } from '@/features/companies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const CompanyListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: companies, isLoading } = useCompanies({ search: searchQuery });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Danh sách Công ty</h1>
          <p className="text-muted-foreground mt-1">Khám phá các môi trường làm việc hàng đầu</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Tên công ty..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
        </form>
      </div>

      <CompanyList companies={companies || []} isLoading={isLoading} />
    </div>
  );
};

export default CompanyListPage;
