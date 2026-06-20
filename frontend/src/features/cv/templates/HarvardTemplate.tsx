import React, { forwardRef } from 'react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';

export const HarvardTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
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

    // Use a serif font for Harvard if not explicitly set
    const actualFont = font !== 'Roboto' ? font : 'Merriweather, Lora, "Times New Roman", serif';

    return (
      <div 
        ref={ref}
        className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-lg overflow-hidden relative print:shadow-none"
        style={{
          fontFamily: actualFont,
          fontSize: getFontSize(),
          lineHeight: lineHeight,
          backgroundColor: background,
          color: '#000',
          padding: '50px 60px'
        }}
      >
        <div className="text-center mb-6">
          <div className="text-3xl font-bold uppercase mb-1" style={{ color: '#000' }}>
            <EditableField mode={mode} color="#000" font={actualFont} value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="NGUYỄN VĂN A" style={{ textAlign: 'center' }} />
          </div>
          <div className="flex justify-center items-center flex-wrap gap-2 text-[14px]">
            {data.personalInfo.address && (
              <>
                <EditableField mode={mode} color="#000" font={actualFont} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Địa chỉ" />
                <span>•</span>
              </>
            )}
            {data.personalInfo.phone && (
              <>
                <EditableField mode={mode} color="#000" font={actualFont} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="Số điện thoại" />
                <span>•</span>
              </>
            )}
            {data.personalInfo.email && (
              <>
                <EditableField mode={mode} color="#000" font={actualFont} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" />
              </>
            )}
            {data.personalInfo.website && (
              <>
                <span className="ml-2">•</span>
                <EditableField mode={mode} color="#000" font={actualFont} value={data.personalInfo.website} onChange={(v) => updateInfo('website', v)} placeholder="LinkedIn/Website" />
              </>
            )}
          </div>
        </div>

        <div className="mb-5">
          <SectionBlock title="MỤC TIÊU NGHỀ NGHIỆP" color="#000" mode={mode} variant="bold-line" titleStyle={{ textAlign: 'center' }} />
          <div className="mt-2 text-justify">
            <EditableField mode={mode} color="#000" font={actualFont} value={data.personalInfo.summary} onChange={(v) => updateInfo('summary', v)} placeholder="Giới thiệu bản thân và mục tiêu nghề nghiệp..." multiline />
          </div>
        </div>

        <div className="mb-5">
          <SectionBlock title="HỌC VẤN" color="#000" mode={mode} variant="bold-line" titleStyle={{ textAlign: 'center' }} />
          <div className="mt-2">
            {data.educations.map((edu, index) => (
              <ItemBlock
                key={edu.id} mode={mode}
                onDelete={() => handleDeleteItem('educations', edu.id)}
                onMoveDown={() => handleMoveItem('educations', index, 1)}
                canMoveDown={index < data.educations.length - 1}
                onAdd={() => handleAddItem('educations', { schoolName: 'Tên trường học', fieldOfStudy: 'Chuyên ngành', startDate: 'YYYY', endDate: 'YYYY', description: '' })}
              >
                <div className="mb-3">
                  <div className="flex justify-between font-bold">
                    <EditableField mode={mode} color="#000" font={actualFont} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="Tên trường học" />
                    <div>
                      <EditableField mode={mode} color="#000" font={actualFont} value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="Bắt đầu" />
                      <span className="mx-1">-</span>
                      <EditableField mode={mode} color="#000" font={actualFont} value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="Kết thúc" />
                    </div>
                  </div>
                  <div className="italic mb-1">
                    <EditableField mode={mode} color="#000" font={actualFont} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Chuyên ngành / Bằng cấp" />
                  </div>
                  <div className="pl-4 relative">
                    <span className="absolute left-0 top-0">•</span>
                    <EditableField mode={mode} color="#000" font={actualFont} value={edu.description} onChange={(v) => handleUpdateItem('educations', index, 'description', v)} placeholder="Mô tả chi tiết..." multiline />
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.educations.length === 0 && mode === 'editor' && (
              <button onClick={() => handleAddItem('educations', { schoolName: 'Trường mới', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mt-1">+ Thêm học vấn</button>
            )}
          </div>
        </div>

        <div className="mb-5">
          <SectionBlock title="KINH NGHIỆM LÀM VIỆC" color="#000" mode={mode} variant="bold-line" titleStyle={{ textAlign: 'center' }} />
          <div className="mt-2">
            {data.experiences.map((exp, index) => (
              <ItemBlock
                key={exp.id} mode={mode}
                onDelete={() => handleDeleteItem('experiences', exp.id)}
                onMoveDown={() => handleMoveItem('experiences', index, 1)}
                canMoveDown={index < data.experiences.length - 1}
                onAdd={() => handleAddItem('experiences', { companyName: 'Tên công ty', jobTitle: 'Vị trí', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
              >
                <div className="mb-4">
                  <div className="flex justify-between font-bold">
                    <EditableField mode={mode} color="#000" font={actualFont} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Tên công ty" />
                    <div>
                      <EditableField mode={mode} color="#000" font={actualFont} value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="Bắt đầu" />
                      <span className="mx-1">-</span>
                      <EditableField mode={mode} color="#000" font={actualFont} value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="Kết thúc" />
                    </div>
                  </div>
                  <div className="italic mb-1">
                    <EditableField mode={mode} color="#000" font={actualFont} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Vị trí công việc" />
                  </div>
                  <div className="pl-4 relative">
                    <span className="absolute left-0 top-0">•</span>
                    <EditableField mode={mode} color="#000" font={actualFont} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="Mô tả các thành tựu..." multiline />
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.experiences.length === 0 && mode === 'editor' && (
              <button onClick={() => handleAddItem('experiences', { companyName: 'Công ty mới', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mt-1">+ Thêm kinh nghiệm</button>
            )}
          </div>
        </div>

        <div className="mb-5">
          <SectionBlock title="KỸ NĂNG & CHỨNG CHỈ" color="#000" mode={mode} variant="bold-line" titleStyle={{ textAlign: 'center' }} />
          <div className="mt-2 space-y-2">
            {data.skills.map((skill, index) => (
              <ItemBlock
                key={skill.id} mode={mode}
                onDelete={() => handleDeleteItem('skills', skill.id)}
                onMoveDown={() => handleMoveItem('skills', index, 1)}
                canMoveDown={index < data.skills.length - 1}
                onAdd={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })}
              >
                <div className="pl-4 relative">
                  <span className="absolute left-0 top-0 font-bold">•</span>
                  <span className="font-bold mr-2">
                    <EditableField mode={mode} color="#000" font={actualFont} value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Tên kỹ năng" className="inline-block" />:
                  </span>
                  <EditableField mode={mode} color="#000" font={actualFont} value={skill.description || ''} onChange={(v) => handleUpdateItem('skills', index, 'description', v)} placeholder="Mô tả kỹ năng..." className="inline-block" />
                </div>
              </ItemBlock>
            ))}
            
            {data.certificates && data.certificates.length > 0 && data.certificates.map((cert, index) => (
              <ItemBlock
                key={cert.id} mode={mode}
                onDelete={() => handleDeleteItem('certificates', cert.id)}
                onMoveDown={() => handleMoveItem('certificates', index, 1)}
                canMoveDown={index < data.certificates.length - 1}
                onAdd={() => handleAddItem('certificates', { name: 'Chứng chỉ mới', issueDate: 'YYYY', issuer: '' })}
              >
                <div className="pl-4 relative">
                  <span className="absolute left-0 top-0 font-bold">•</span>
                  <span className="font-bold mr-2">
                    <EditableField mode={mode} color="#000" font={actualFont} value={cert.name} onChange={(v) => handleUpdateItem('certificates', index, 'name', v)} placeholder="Tên chứng chỉ" className="inline-block" />
                    {cert.issueDate && <span> ({cert.issueDate})</span>}
                    :
                  </span>
                  <EditableField mode={mode} color="#000" font={actualFont} value={cert.issuer} onChange={(v) => handleUpdateItem('certificates', index, 'issuer', v)} placeholder="Tổ chức cấp" className="inline-block" />
                </div>
              </ItemBlock>
            ))}
            {mode === 'editor' && (
              <div className="flex gap-4">
                {data.skills.length === 0 && <button onClick={() => handleAddItem('skills', { name: 'Kỹ năng', description: '' })} className="text-sm text-blue-500 underline mt-1">+ Thêm kỹ năng</button>}
                {(!data.certificates || data.certificates.length === 0) && <button onClick={() => handleAddItem('certificates', { name: 'Chứng chỉ', issueDate: '', issuer: '' })} className="text-sm text-blue-500 underline mt-1">+ Thêm chứng chỉ</button>}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }
);
HarvardTemplate.displayName = 'HarvardTemplate';
