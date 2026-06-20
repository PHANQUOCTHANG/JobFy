import React from 'react';
import { CvData, Experience } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface ExperienceFormProps {
  data: CvData['experiences'];
  onChange: (data: CvData['experiences']) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        id: `exp_${Date.now()}`,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
      }
    ]);
  };

  const handleRemove = (id: string) => {
    onChange(data.filter(item => item.id !== id));
  };

  const handleChange = (id: string, field: keyof Experience, value: any) => {
    onChange(
      data.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-6">
      {data.map((item, index) => (
        <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
          <button
            onClick={() => handleRemove(item.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
          
          <h4 className="font-semibold text-gray-700 mb-4">Kinh nghiệm {index + 1}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Tên công ty"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
              <input
                type="text"
                value={item.position}
                onChange={(e) => handleChange(item.id, 'position', e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Vị trí đảm nhiệm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input
                type="month"
                value={item.startDate}
                onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
              <div className="flex items-center gap-3">
                <input
                  type="month"
                  value={item.endDate}
                  disabled={item.isCurrent}
                  onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5] disabled:bg-gray-200 disabled:text-gray-500"
                />
                <label className="flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={item.isCurrent}
                    onChange={(e) => handleChange(item.id, 'isCurrent', e.target.checked)}
                    className="rounded text-[#4F46E5] focus:ring-[#4F46E5]"
                  />
                  Hiện tại
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc</label>
              <textarea
                value={item.description}
                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="- Thành tựu 1&#10;- Trách nhiệm 2"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-[#4F46E5] text-[#4F46E5] rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#f0f5ff] transition-colors"
      >
        <Plus size={20} /> Thêm kinh nghiệm làm việc
      </button>
    </div>
  );
};
