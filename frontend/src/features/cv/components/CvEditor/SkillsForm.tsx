import React, { useState } from 'react';
import { CvData } from '../../types';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  data: CvData['skills'];
  onChange: (data: CvData['skills']) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([
        ...data,
        {
          id: `skill_${Date.now()}`,
          name: inputValue.trim(),
          level: 4 // default level
        }
      ]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (id: string) => {
    onChange(data.filter(item => item.id !== id));
  };

  const handleLevelChange = (id: string, level: number) => {
    onChange(
      data.map(item => (item.id === id ? { ...item, level } : item))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
          placeholder="Nhập kỹ năng (VD: ReactJS, Tiếng Anh...) và nhấn Enter"
        />
        <button
          onClick={handleAdd}
          className="bg-[#4F46E5] text-white px-4 py-2 rounded-md hover:bg-[#4338CA] transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3 mt-4">
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center py-4">Chưa có kỹ năng nào được thêm.</p>
        ) : (
          data.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-700">{skill.name}</span>
              
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelChange(skill.id, level)}
                      className={`w-4 h-4 rounded-full transition-colors ${
                        (skill.level || 0) >= level ? 'bg-[#4F46E5]' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={`Mức độ ${level}/5`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleRemove(skill.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
