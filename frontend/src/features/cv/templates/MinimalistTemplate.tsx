import React, { forwardRef } from 'react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';

export const MinimalistTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
  // eslint-disable-next-line unused-imports/no-unused-vars
  ({ data, color, font, fontSize, lineHeight, background, mode, onUpdatePersonalInfo, onUpdateArrayField }, ref) => {
    
    // Handlers
    const updateInfo = (field: keyof typeof data.personalInfo, value: string) => {
      if (onUpdatePersonalInfo) onUpdatePersonalInfo({ [field]: value });
    };

    const handleUpdateItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(
      field: K, index: number, itemField: string, value: string
    ) => {
      if (!onUpdateArrayField) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newList = [...data[field]] as any[];
      newList[index] = { ...newList[index], [itemField]: value };
      onUpdateArrayField(field, newList);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(field: K, newItem: any) => {
      if (!onUpdateArrayField) return;
      onUpdateArrayField(field, [...data[field], { ...newItem, id: uuidv4() }]);
    };

    const handleDeleteItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(field: K, id: string) => {
      if (!onUpdateArrayField) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onUpdateArrayField(field, data[field].filter((item: any) => item.id !== id) as any);
    };

    const handleMoveItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(field: K, index: number, direction: 1 | -1) => {
      if (!onUpdateArrayField) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newList = [...data[field]] as any[];
      if (index + direction < 0 || index + direction >= newList.length) return;
      const temp = newList[index];
      newList[index] = newList[index + direction];
      newList[index + direction] = temp;
      onUpdateArrayField(field, newList);
    };

    const getFontSize = () => {
      if (fontSize === 'small') return '13px';
      if (fontSize === 'large') return '17px';
      return '15px'; // medium
    };

    return (
      <div 
        ref={ref}
        className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-lg overflow-hidden relative print:shadow-none"
        style={{
          fontFamily: font,
          fontSize: getFontSize(),
          lineHeight: lineHeight,
          backgroundColor: background,
          color: '#333',
          padding: '60px 80px' // Extra generous padding for minimalist look
        }}
      >
        <div className="mb-10">
          <div className="text-4xl font-normal tracking-tight mb-2 text-black">
            <EditableField mode={mode} color="#000" font={font} value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="Họ và Tên" />
          </div>
          <div className="text-xl font-medium text-gray-500 mb-6">
            <EditableField mode={mode} color="#6b7280" font={font} value={data.personalInfo.jobTitle} onChange={(v) => updateInfo('jobTitle', v)} placeholder="Vị trí ứng tuyển" />
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-gray-500">
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <EditableField mode={mode} color="#6b7280" font={font} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="Số điện thoại" />
                <span>•</span>
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <EditableField mode={mode} color="#6b7280" font={font} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" />
                <span>•</span>
              </div>
            )}
            {data.personalInfo.address && (
              <div className="flex items-center gap-2">
                <EditableField mode={mode} color="#6b7280" font={font} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Địa chỉ" />
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <span className="mr-2">•</span>
                <EditableField mode={mode} color="#6b7280" font={font} value={data.personalInfo.website} onChange={(v) => updateInfo('website', v)} placeholder="Website / LinkedIn" />
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <SectionBlock title="Giới thiệu" color="#000" mode={mode} variant="none" titleStyle={{ textTransform: 'none', fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }} />
          <div className="text-gray-700 leading-relaxed font-light">
            <EditableField mode={mode} color="#374151" font={font} value={data.personalInfo.summary} onChange={(v) => updateInfo('summary', v)} placeholder="Viết một đoạn ngắn giới thiệu bản thân..." multiline />
          </div>
        </div>

        <div className="mb-8">
          <SectionBlock title="Kinh nghiệm làm việc" color="#000" mode={mode} variant="none" titleStyle={{ textTransform: 'none', fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }} />
          <div className="space-y-6">
            {data.experiences.map((exp, index) => (
              <ItemBlock
                key={exp.id} mode={mode}
                onDelete={() => handleDeleteItem('experiences', exp.id)}
                onMoveDown={() => handleMoveItem('experiences', index, 1)}
                canMoveDown={index < data.experiences.length - 1}
                onAdd={() => handleAddItem('experiences', { companyName: 'Công ty', jobTitle: 'Vị trí', startDate: 'YYYY', endDate: 'YYYY', description: '' })}
              >
                <div className="flex">
                  <div className="w-[25%] text-[14px] text-gray-500 font-medium pt-0.5">
                    <EditableField mode={mode} color="#6b7280" font={font} value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="Từ" className="inline-block" />
                    <span className="mx-1">—</span>
                    <EditableField mode={mode} color="#6b7280" font={font} value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="Đến" className="inline-block" />
                  </div>
                  <div className="w-[75%]">
                    <div className="font-semibold text-black text-[16px] mb-0.5">
                      <EditableField mode={mode} color="#000" font={font} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Vị trí công việc" />
                    </div>
                    <div className="text-gray-600 mb-2 font-medium">
                      <EditableField mode={mode} color="#4b5563" font={font} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Tên công ty" />
                    </div>
                    <div className="text-gray-600 font-light leading-relaxed">
                      <EditableField mode={mode} color="#4b5563" font={font} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="Mô tả công việc..." multiline />
                    </div>
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.experiences.length === 0 && mode === 'editor' && (
              <button onClick={() => handleAddItem('experiences', { companyName: 'Công ty mới', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-gray-500 underline">+ Thêm</button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <SectionBlock title="Học vấn" color="#000" mode={mode} variant="none" titleStyle={{ textTransform: 'none', fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }} />
          <div className="space-y-6">
            {data.educations.map((edu, index) => (
              <ItemBlock
                key={edu.id} mode={mode}
                onDelete={() => handleDeleteItem('educations', edu.id)}
                onMoveDown={() => handleMoveItem('educations', index, 1)}
                canMoveDown={index < data.educations.length - 1}
                onAdd={() => handleAddItem('educations', { schoolName: 'Trường học', fieldOfStudy: 'Chuyên ngành', startDate: 'YYYY', endDate: 'YYYY', description: '' })}
              >
                <div className="flex">
                  <div className="w-[25%] text-[14px] text-gray-500 font-medium pt-0.5">
                    <EditableField mode={mode} color="#6b7280" font={font} value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="Từ" className="inline-block" />
                    <span className="mx-1">—</span>
                    <EditableField mode={mode} color="#6b7280" font={font} value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="Đến" className="inline-block" />
                  </div>
                  <div className="w-[75%]">
                    <div className="font-semibold text-black text-[16px] mb-0.5">
                      <EditableField mode={mode} color="#000" font={font} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="Tên trường học" />
                    </div>
                    <div className="text-gray-600 mb-1 font-medium">
                      <EditableField mode={mode} color="#4b5563" font={font} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Chuyên ngành / Bằng cấp" />
                    </div>
                    <div className="text-gray-600 font-light">
                      <EditableField mode={mode} color="#4b5563" font={font} value={edu.description} onChange={(v) => handleUpdateItem('educations', index, 'description', v)} placeholder="Mô tả..." multiline />
                    </div>
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.educations.length === 0 && mode === 'editor' && (
              <button onClick={() => handleAddItem('educations', { schoolName: 'Trường mới', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-gray-500 underline">+ Thêm</button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <SectionBlock title="Kỹ năng" color="#000" mode={mode} variant="none" titleStyle={{ textTransform: 'none', fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }} />
          <div className="flex flex-wrap gap-x-2 gap-y-2 mt-4">
            {data.skills.map((skill, index) => (
              <ItemBlock
                key={skill.id} mode={mode}
                onDelete={() => handleDeleteItem('skills', skill.id)}
                onMoveDown={() => handleMoveItem('skills', index, 1)}
                canMoveDown={index < data.skills.length - 1}
                onAdd={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })}
              >
                <div className="bg-gray-100 px-4 py-1.5 rounded-full text-gray-700 text-[14px]">
                  <EditableField mode={mode} color="#374151" font={font} value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Tên kỹ năng" />
                </div>
              </ItemBlock>
            ))}
            {mode === 'editor' && (
              <button onClick={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })} className="bg-white border border-dashed border-gray-300 px-4 py-1.5 rounded-full text-gray-400 text-[14px] hover:border-gray-400 hover:text-gray-500 transition-colors">+ Thêm kỹ năng</button>
            )}
          </div>
        </div>

      </div>
    );
  }
);
MinimalistTemplate.displayName = 'MinimalistTemplate';
