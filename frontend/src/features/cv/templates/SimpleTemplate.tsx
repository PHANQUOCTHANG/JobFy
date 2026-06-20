import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';

export const SimpleTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ data, color, font, fontSize, lineHeight, background, mode, onUpdatePersonalInfo, onUpdateArrayField }, ref) => {
    
    const updateInfo = (field: keyof typeof data.personalInfo, value: string) => {
      if (onUpdatePersonalInfo) onUpdatePersonalInfo({ [field]: value });
    };

    const handleUpdateItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(
      field: K, index: number, itemField: string, value: string
    ) => {
      if (!onUpdateArrayField) return;
      const newList = [...data[field]] as any[];
      newList[index] = { ...newList[index], [itemField]: value };
      onUpdateArrayField(field, newList);
    };

    const handleAddItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(field: K, newItem: any) => {
      if (!onUpdateArrayField) return;
      onUpdateArrayField(field, [...data[field], { ...newItem, id: uuidv4() }]);
    };

    const handleDeleteItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(field: K, id: string) => {
      if (!onUpdateArrayField) return;
      onUpdateArrayField(field, data[field].filter((item: any) => item.id !== id) as any);
    };

    const handleMoveItem = <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(field: K, index: number, direction: 1 | -1) => {
      if (!onUpdateArrayField) return;
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
          padding: '40px 50px'
        }}
      >
        {/* HEADER (1 column) */}
        <div className="flex gap-6 items-center mb-8 pb-6 border-b-2" style={{ borderBottomColor: color }}>
          <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
            {data.personalInfo.avatarUrl ? (
              <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Ảnh</div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-3xl font-bold uppercase mb-2" style={{ color }}>
              <EditableField mode={mode} color={color} font={font} value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="HỌ VÀ TÊN" />
            </div>
            <div className="text-xl font-medium text-gray-600 mb-4 uppercase">
              <EditableField mode={mode} color={color} font={font} value={data.personalInfo.jobTitle} onChange={(v) => updateInfo('jobTitle', v)} placeholder="VỊ TRÍ ỨNG TUYỂN" />
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Phone size={14} style={{ color }} />
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="Số điện thoại" />
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} style={{ color }} />
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" />
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color }} />
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Địa chỉ" />
              </div>
              {data.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe size={14} style={{ color }} />
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.website} onChange={(v) => updateInfo('website', v)} placeholder="Website / LinkedIn" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-6">
          <SectionBlock title="MỤC TIÊU NGHỀ NGHIỆP" color={color} mode={mode} variant="underline" />
          <div className="mt-2 text-gray-700">
            <EditableField mode={mode} color={color} font={font} value={data.personalInfo.summary} onChange={(v) => updateInfo('summary', v)} placeholder="Giới thiệu bản thân và mục tiêu..." multiline />
          </div>
        </div>

        {/* EDUCATION */}
        <div className="mb-6">
          <SectionBlock title="HỌC VẤN" color={color} mode={mode} variant="underline" />
          <div className="mt-2">
            {data.educations.map((edu, index) => (
              <ItemBlock
                key={edu.id} mode={mode}
                onDelete={() => handleDeleteItem('educations', edu.id)}
                onMoveDown={() => handleMoveItem('educations', index, 1)}
                canMoveDown={index < data.educations.length - 1}
                onAdd={() => handleAddItem('educations', { schoolName: 'Tên trường học', fieldOfStudy: 'Chuyên ngành', startDate: 'YYYY', endDate: 'YYYY', description: '' })}
              >
                <div className="flex mb-2">
                  <div className="w-1/4 pr-4 border-r-2" style={{ borderColor: `${color}40` }}>
                    <div className="font-semibold text-[15px]" style={{ color }}>
                      <EditableField mode={mode} color={color} font={font} value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="Bắt đầu" />
                      <span className="mx-1">-</span>
                      <EditableField mode={mode} color={color} font={font} value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="Kết thúc" />
                    </div>
                  </div>
                  <div className="w-3/4 pl-4">
                    <div className="font-bold text-[15px] uppercase text-gray-800">
                      <EditableField mode={mode} color={color} font={font} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="Tên trường học" />
                    </div>
                    <div className="font-medium text-gray-600 mb-1 text-[14px]">
                      <EditableField mode={mode} color={color} font={font} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Chuyên ngành / Bằng cấp" />
                    </div>
                    <div className="text-gray-600 text-[13.5px]">
                      <EditableField mode={mode} color={color} font={font} value={edu.description} onChange={(v) => handleUpdateItem('educations', index, 'description', v)} placeholder="Mô tả thêm..." multiline />
                    </div>
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.educations.length === 0 && mode === 'editor' && (
              <button onClick={() => handleAddItem('educations', { schoolName: 'Trường mới', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mt-1">+ Thêm học vấn</button>
            )}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="mb-6">
          <SectionBlock title="KINH NGHIỆM LÀM VIỆC" color={color} mode={mode} variant="underline" />
          <div className="mt-2">
            {data.experiences.map((exp, index) => (
              <ItemBlock
                key={exp.id} mode={mode}
                onDelete={() => handleDeleteItem('experiences', exp.id)}
                onMoveDown={() => handleMoveItem('experiences', index, 1)}
                canMoveDown={index < data.experiences.length - 1}
                onAdd={() => handleAddItem('experiences', { companyName: 'Tên công ty', jobTitle: 'Vị trí', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
              >
                <div className="flex mb-4">
                  <div className="w-1/4 pr-4 border-r-2" style={{ borderColor: `${color}40` }}>
                    <div className="font-semibold text-[15px]" style={{ color }}>
                      <EditableField mode={mode} color={color} font={font} value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="Bắt đầu" />
                      <span className="mx-1">-</span>
                      <EditableField mode={mode} color={color} font={font} value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="Kết thúc" />
                    </div>
                  </div>
                  <div className="w-3/4 pl-4">
                    <div className="font-bold text-[15px] uppercase text-gray-800">
                      <EditableField mode={mode} color={color} font={font} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Tên công ty" />
                    </div>
                    <div className="font-medium text-gray-600 mb-1 text-[14px]">
                      <EditableField mode={mode} color={color} font={font} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Vị trí công việc" />
                    </div>
                    <div className="text-gray-600 text-[13.5px]">
                      <EditableField mode={mode} color={color} font={font} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="Mô tả chi tiết công việc..." multiline />
                    </div>
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.experiences.length === 0 && mode === 'editor' && (
              <button onClick={() => handleAddItem('experiences', { companyName: 'Công ty mới', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mt-1">+ Thêm kinh nghiệm</button>
            )}
          </div>
        </div>

        {/* SKILLS */}
        <div className="mb-6">
          <SectionBlock title="KỸ NĂNG" color={color} mode={mode} variant="underline" />
          <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-3">
            {data.skills.map((skill, index) => (
              <ItemBlock
                key={skill.id} mode={mode}
                onDelete={() => handleDeleteItem('skills', skill.id)}
                onMoveDown={() => handleMoveItem('skills', index, 1)}
                canMoveDown={index < data.skills.length - 1}
                onAdd={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })}
              >
                <div>
                  <div className="font-semibold text-gray-800 text-[14px] flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                    <EditableField mode={mode} color={color} font={font} value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Tên kỹ năng" />
                  </div>
                  <div className="text-gray-600 text-[13px] ml-4 mt-0.5">
                    <EditableField mode={mode} color={color} font={font} value={(skill as any).description || ''} onChange={(v) => handleUpdateItem('skills', index, 'description', v)} placeholder="Mô tả..." multiline />
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.skills.length === 0 && mode === 'editor' && (
              <button onClick={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })} className="text-sm text-blue-500 underline mt-1 col-span-2">+ Thêm kỹ năng</button>
            )}
          </div>
        </div>

      </div>
    );
  }
);
SimpleTemplate.displayName = 'SimpleTemplate';
