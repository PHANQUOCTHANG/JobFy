import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';

export const ExecutiveTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
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
          color: '#333'
        }}
      >
        <div className="w-full pt-10 pb-8 px-10 text-white flex items-center gap-8" style={{ backgroundColor: color }}>
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/50 shadow-sm flex-shrink-0 bg-white text-gray-400 flex items-center justify-center">
            {data.personalInfo.avatarUrl ? (
              <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              "Ảnh"
            )}
          </div>
          
          <div className="flex-1">
            <div className="text-3xl font-black uppercase mb-1 tracking-wider text-white">
              <EditableField mode={mode} color="#fff" font={font} value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="HỌ VÀ TÊN" />
            </div>
            <div className="text-[17px] font-medium text-white/90 uppercase tracking-widest mb-4">
              <EditableField mode={mode} color="#fff" font={font} value={data.personalInfo.jobTitle} onChange={(v) => updateInfo('jobTitle', v)} placeholder="VỊ TRÍ ỨNG TUYỂN" />
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[13px] text-white/80">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <EditableField mode={mode} color="#fff" font={font} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="SĐT" />
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <EditableField mode={mode} color="#fff" font={font} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" />
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <EditableField mode={mode} color="#fff" font={font} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Địa chỉ" />
              </div>
              {data.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe size={14} />
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.website || ''} onChange={(v) => updateInfo('website', v)} placeholder="Website / LinkedIn" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex px-10 pt-8 pb-10 gap-10">
          <div className="w-[30%] border-r border-gray-200 pr-8">
            <div className="mb-8">
              <SectionBlock title="KỸ NĂNG NỔI BẬT" color={color} mode={mode} variant="line" />
              <div className="mt-4 space-y-3">
                {data.skills.map((skill, index) => (
                  <ItemBlock
                    key={skill.id} mode={mode}
                    onDelete={() => handleDeleteItem('skills', skill.id)}
                    onMoveDown={() => handleMoveItem('skills', index, 1)}
                    canMoveDown={index < data.skills.length - 1}
                    onAdd={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })}
                  >
                    <div>
                      <div className="font-bold text-gray-800 text-[14px]">
                        <EditableField mode={mode} color={color} font={font} value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Tên kỹ năng" />
                      </div>
                      <div className="text-gray-500 text-[13px] leading-relaxed">
                        <EditableField mode={mode} color={color} font={font} value={skill.description || ''} onChange={(v) => handleUpdateItem('skills', index, 'description', v)} placeholder="Chi tiết..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.skills.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })} className="text-sm text-[#00B14F] underline mt-1">+ Thêm kỹ năng</button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <SectionBlock title="CHỨNG CHỈ" color={color} mode={mode} variant="line" />
              <div className="mt-4 space-y-4">
                {data.certificates?.map((cert, index) => (
                  <ItemBlock
                    key={cert.id} mode={mode}
                    onDelete={() => handleDeleteItem('certificates', cert.id)}
                    onMoveDown={() => handleMoveItem('certificates', index, 1)}
                    canMoveDown={index < data.certificates.length - 1}
                    onAdd={() => handleAddItem('certificates', { name: 'Chứng chỉ mới', issueDate: 'YYYY', issuer: 'Tổ chức cấp' })}
                  >
                    <div>
                      <div className="font-bold text-gray-800 text-[14px]">
                        <EditableField mode={mode} color={color} font={font} value={cert.name} onChange={(v) => handleUpdateItem('certificates', index, 'name', v)} placeholder="Tên chứng chỉ" />
                      </div>
                      <div className="text-gray-500 text-[13px] mb-1">
                        <EditableField mode={mode} color={color} font={font} value={cert.issuer} onChange={(v) => handleUpdateItem('certificates', index, 'issuer', v)} placeholder="Tổ chức cấp" />
                      </div>
                      <div className="text-[12px] font-medium px-2 py-0.5 rounded inline-block" style={{ backgroundColor: `${color}20`, color: color }}>
                        <EditableField mode={mode} color={color} font={font} value={cert.issueDate} onChange={(v) => handleUpdateItem('certificates', index, 'issueDate', v)} placeholder="Năm cấp" />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {(!data.certificates || data.certificates.length === 0) && mode === 'editor' && (
                  <button onClick={() => handleAddItem('certificates', { name: 'Chứng chỉ mới', issueDate: '', issuer: '' })} className="text-sm text-[#00B14F] underline mt-1">+ Thêm chứng chỉ</button>
                )}
              </div>
            </div>
          </div>

          <div className="w-[70%]">
            <div className="mb-8">
              <SectionBlock title="TỔNG QUAN" color={color} mode={mode} variant="background" />
              <div className="mt-3 text-gray-700 leading-relaxed text-[15px] pl-2">
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.summary} onChange={(v) => updateInfo('summary', v)} placeholder="Mô tả tổng quan về kinh nghiệm và mục tiêu..." multiline />
              </div>
            </div>

            <div className="mb-8">
              <SectionBlock title="KINH NGHIỆM LÀM VIỆC" color={color} mode={mode} variant="background" />
              <div className="mt-4 space-y-6">
                {data.experiences.map((exp, index) => (
                  <ItemBlock
                    key={exp.id} mode={mode}
                    onDelete={() => handleDeleteItem('experiences', exp.id)}
                    onMoveDown={() => handleMoveItem('experiences', index, 1)}
                    canMoveDown={index < data.experiences.length - 1}
                    onAdd={() => handleAddItem('experiences', { companyName: 'Tên công ty', jobTitle: 'Vị trí', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
                  >
                    <div className="pl-2">
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="font-bold text-[16px] text-gray-900">
                          <EditableField mode={mode} color={color} font={font} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Vị trí công việc" />
                        </div>
                        <div className="text-[13px] font-semibold" style={{ color }}>
                          <EditableField mode={mode} color={color} font={font} value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="Bắt đầu" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color={color} font={font} value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="Kết thúc" />
                        </div>
                      </div>
                      <div className="font-medium text-gray-500 uppercase text-[13px] tracking-wide mb-2">
                        <EditableField mode={mode} color={color} font={font} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Tên công ty" />
                      </div>
                      <div className="text-gray-700 text-[14px] leading-relaxed">
                        <EditableField mode={mode} color={color} font={font} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="Mô tả chi tiết..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.experiences.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('experiences', { companyName: 'Công ty mới', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-[#00B14F] underline mt-1">+ Thêm kinh nghiệm</button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <SectionBlock title="TRÌNH ĐỘ HỌC VẤN" color={color} mode={mode} variant="background" />
              <div className="mt-4 space-y-5">
                {data.educations.map((edu, index) => (
                  <ItemBlock
                    key={edu.id} mode={mode}
                    onDelete={() => handleDeleteItem('educations', edu.id)}
                    onMoveDown={() => handleMoveItem('educations', index, 1)}
                    canMoveDown={index < data.educations.length - 1}
                    onAdd={() => handleAddItem('educations', { schoolName: 'Tên trường học', fieldOfStudy: 'Chuyên ngành', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
                  >
                    <div className="pl-2">
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="font-bold text-[15px] text-gray-900 uppercase">
                          <EditableField mode={mode} color={color} font={font} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="Tên trường học" />
                        </div>
                        <div className="text-[13px] font-semibold" style={{ color }}>
                          <EditableField mode={mode} color={color} font={font} value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="Từ" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color={color} font={font} value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="Đến" />
                        </div>
                      </div>
                      <div className="font-medium text-gray-600 mb-1">
                        <EditableField mode={mode} color={color} font={font} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Bằng cấp / Chuyên ngành" />
                      </div>
                      <div className="text-gray-500 text-[13.5px]">
                        <EditableField mode={mode} color={color} font={font} value={edu.description} onChange={(v) => handleUpdateItem('educations', index, 'description', v)} placeholder="Mô tả..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.educations.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('educations', { schoolName: 'Trường mới', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-[#00B14F] underline mt-1">+ Thêm học vấn</button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
);
ExecutiveTemplate.displayName = 'ExecutiveTemplate';
