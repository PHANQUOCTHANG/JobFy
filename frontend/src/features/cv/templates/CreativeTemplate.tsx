import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';

export const CreativeTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ data, color, font, fontSize, lineHeight, background, mode, onUpdatePersonalInfo, onUpdateArrayField }, ref) => {
    
    // Handlers (same as ModernTemplate)
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

    // Dark sidebar based on primary color
    const isDarkColor = true; // Assume primary colors are generally dark enough, we'll use a very dark version
    
    return (
      <div 
        ref={ref}
        className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-lg overflow-hidden relative print:shadow-none"
        style={{
          fontFamily: font,
          fontSize: getFontSize(),
          lineHeight: lineHeight,
          backgroundColor: background,
          color: '#333'
        }}
      >
        <div className="flex min-h-[1123px]">
          {/* DARK SIDEBAR */}
          <div className="w-[38%] flex flex-col pt-10 pb-8 px-6 text-white" style={{ backgroundColor: '#212529' }}>
            {/* Avatar */}
            <div className="w-44 h-44 mx-auto rounded-full overflow-hidden border-4 mb-6 shadow-md" style={{ borderColor: color }}>
              {data.personalInfo.avatarUrl ? (
                <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-300">Ảnh</div>
              )}
            </div>

            {/* Contact Info */}
            <div className="mb-8">
              <SectionBlock title="LIÊN HỆ" color={color} mode={mode} variant="none" titleStyle={{ borderBottom: `2px solid ${color}`, display: 'inline-block', paddingBottom: 2 }} />
              <div className="space-y-4 mt-5 text-[14px] text-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-gray-800 flex items-center justify-center flex-shrink-0" style={{ color }}><Phone size={14} /></div>
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="SĐT" className="mt-1" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-gray-800 flex items-center justify-center flex-shrink-0" style={{ color }}><Mail size={14} /></div>
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" className="mt-1" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-gray-800 flex items-center justify-center flex-shrink-0" style={{ color }}><MapPin size={14} /></div>
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Địa chỉ" className="mt-1" />
                </div>
                {data.personalInfo.website && (
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-gray-800 flex items-center justify-center flex-shrink-0" style={{ color }}><Globe size={14} /></div>
                    <EditableField mode={mode} color={color} font={font} value={data.personalInfo.website || ''} onChange={(v) => updateInfo('website', v)} placeholder="Website / Portfolio" className="mt-1" />
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <SectionBlock title="KỸ NĂNG" color={color} mode={mode} variant="none" titleStyle={{ borderBottom: `2px solid ${color}`, display: 'inline-block', paddingBottom: 2 }} />
              <div className="mt-5 space-y-4">
                {data.skills.map((skill, index) => (
                  <ItemBlock
                    key={skill.id} mode={mode}
                    onDelete={() => handleDeleteItem('skills', skill.id)}
                    onMoveDown={() => handleMoveItem('skills', index, 1)}
                    canMoveDown={index < data.skills.length - 1}
                    onAdd={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })}
                  >
                    <div>
                      <div className="font-semibold text-gray-100 text-[14px] mb-1 uppercase tracking-wide">
                        <EditableField mode={mode} color={color} font={font} value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Kỹ năng" />
                      </div>
                      <div className="text-gray-400 text-[13px]">
                        <EditableField mode={mode} color={color} font={font} value={skill.description || ''} onChange={(v) => handleUpdateItem('skills', index, 'description', v)} placeholder="Mô tả (tùy chọn)..." multiline />
                      </div>
                      {/* Fake progress bar purely for creative look */}
                      <div className="w-full h-1.5 bg-gray-800 mt-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full opacity-80" style={{ backgroundColor: color, width: `${Math.max(40, 100 - index * 10)}%` }}></div>
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.skills.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })} className="text-sm text-[#00B14F] underline mt-2">+ Thêm kỹ năng</button>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="w-[62%] pt-12 pb-8 pr-10 pl-8">
            {/* Header Name */}
            <div className="mb-10">
              <div className="text-4xl font-black uppercase mb-2 tracking-tight" style={{ color: '#212529' }}>
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="HỌ VÀ TÊN" />
              </div>
              <div className="text-xl font-bold uppercase tracking-widest" style={{ color }}>
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.jobTitle} onChange={(v) => updateInfo('jobTitle', v)} placeholder="VỊ TRÍ ỨNG TUYỂN" />
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: color }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <SectionBlock title="MỤC TIÊU NGHỀ NGHIỆP" color={color} mode={mode} variant="none" style={{ marginBottom: 0 }} titleStyle={{ fontSize: 18, letterSpacing: 1 }} />
              </div>
              <div className="text-gray-700 leading-relaxed pl-11">
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.summary} onChange={(v) => updateInfo('summary', v)} placeholder="Giới thiệu bản thân..." multiline />
              </div>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: color }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <SectionBlock title="KINH NGHIỆM LÀM VIỆC" color={color} mode={mode} variant="none" style={{ marginBottom: 0 }} titleStyle={{ fontSize: 18, letterSpacing: 1 }} />
              </div>
              <div className="pl-11 relative">
                <div className="absolute left-[27px] top-2 bottom-0 w-0.5 bg-gray-200"></div>
                {data.experiences.map((exp, index) => (
                  <ItemBlock
                    key={exp.id} mode={mode}
                    onDelete={() => handleDeleteItem('experiences', exp.id)}
                    onMoveDown={() => handleMoveItem('experiences', index, 1)}
                    canMoveDown={index < data.experiences.length - 1}
                    onAdd={() => handleAddItem('experiences', { companyName: 'Công ty', jobTitle: 'Vị trí', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
                  >
                    <div className="mb-6 relative">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: color }}></div>
                      <div className="font-bold text-[16px] text-gray-800 uppercase mb-0.5">
                        <EditableField mode={mode} color={color} font={font} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Tên công ty" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium" style={{ color }}>
                          <EditableField mode={mode} color={color} font={font} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Vị trí" />
                        </span>
                        <span className="text-gray-400 text-xs px-2 py-0.5 rounded-full bg-gray-100 italic">
                          <EditableField mode={mode} color={color} font={font} value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="Từ" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color={color} font={font} value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="Đến" />
                        </span>
                      </div>
                      <div className="text-gray-600 text-[14px]">
                        <EditableField mode={mode} color={color} font={font} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="Mô tả chi tiết..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.experiences.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('experiences', { companyName: 'Mới', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mb-4 ml-4">+ Thêm</button>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: color }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <SectionBlock title="HỌC VẤN" color={color} mode={mode} variant="none" style={{ marginBottom: 0 }} titleStyle={{ fontSize: 18, letterSpacing: 1 }} />
              </div>
              <div className="pl-11 relative">
                <div className="absolute left-[27px] top-2 bottom-0 w-0.5 bg-gray-200"></div>
                {data.educations.map((edu, index) => (
                  <ItemBlock
                    key={edu.id} mode={mode}
                    onDelete={() => handleDeleteItem('educations', edu.id)}
                    onMoveDown={() => handleMoveItem('educations', index, 1)}
                    canMoveDown={index < data.educations.length - 1}
                    onAdd={() => handleAddItem('educations', { schoolName: 'Trường', fieldOfStudy: 'Chuyên ngành', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
                  >
                    <div className="mb-6 relative">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: color }}></div>
                      <div className="font-bold text-[16px] text-gray-800 uppercase mb-0.5">
                        <EditableField mode={mode} color={color} font={font} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="Tên trường học" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium" style={{ color }}>
                          <EditableField mode={mode} color={color} font={font} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Bằng cấp" />
                        </span>
                        <span className="text-gray-400 text-xs px-2 py-0.5 rounded-full bg-gray-100 italic">
                          <EditableField mode={mode} color={color} font={font} value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="Từ" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color={color} font={font} value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="Đến" />
                        </span>
                      </div>
                      <div className="text-gray-600 text-[14px]">
                        <EditableField mode={mode} color={color} font={font} value={edu.description} onChange={(v) => handleUpdateItem('educations', index, 'description', v)} placeholder="Mô tả..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.educations.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('educations', { schoolName: 'Mới', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mb-4 ml-4">+ Thêm</button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
);
CreativeTemplate.displayName = 'CreativeTemplate';
