import React, { forwardRef } from 'react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';

export const ElegantTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ data, color, font, fontSize, lineHeight, background, mode, onUpdatePersonalInfo, onUpdateArrayField }, ref) => {
    
    // Handlers
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

    const actualFont = font !== 'Roboto' ? font : 'Playfair Display, Lora, serif';

    return (
      <div 
        ref={ref}
        className="w-[794px] min-h-[1123px] mx-auto shadow-lg overflow-hidden relative print:shadow-none bg-[#fdfdfc]"
        style={{
          fontFamily: actualFont,
          fontSize: getFontSize(),
          lineHeight: lineHeight,
          backgroundColor: background !== '#ffffff' ? background : '#fdfdfc',
          color: '#4a4a4a',
          padding: '60px 70px'
        }}
      >
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-28 h-28 rounded-full overflow-hidden mb-6 border bg-gray-100 flex items-center justify-center text-gray-300" style={{ borderColor: color }}>
            {data.personalInfo.avatarUrl ? (
              <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              "Ảnh"
            )}
          </div>
          
          <div className="text-3xl tracking-[0.15em] mb-2 text-[#2c2c2c] uppercase font-medium">
            <EditableField mode={mode} color="#2c2c2c" font={actualFont} value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="HỌ VÀ TÊN" style={{ textAlign: 'center' }} />
          </div>
          <div className="text-lg italic tracking-widest text-gray-500 mb-6">
            <EditableField mode={mode} color="#6b7280" font={actualFont} value={data.personalInfo.jobTitle} onChange={(v) => updateInfo('jobTitle', v)} placeholder="Vị trí ứng tuyển" style={{ textAlign: 'center' }} />
          </div>

          <div className="flex justify-center items-center w-full my-4">
            <div className="h-px w-20 bg-gray-300"></div>
            <div className="mx-4 text-xs" style={{ color }}>✦</div>
            <div className="h-px w-20 bg-gray-300"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13.5px] text-gray-500">
            {data.personalInfo.phone && (
              <div><EditableField mode={mode} color="#6b7280" font={actualFont} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="Số điện thoại" style={{ textAlign: 'center' }} /></div>
            )}
            {data.personalInfo.email && (
              <div><EditableField mode={mode} color="#6b7280" font={actualFont} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" style={{ textAlign: 'center' }} /></div>
            )}
            {data.personalInfo.address && (
              <div><EditableField mode={mode} color="#6b7280" font={actualFont} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Địa chỉ" style={{ textAlign: 'center' }} /></div>
            )}
            {data.personalInfo.website && (
              <div><EditableField mode={mode} color="#6b7280" font={actualFont} value={data.personalInfo.website} onChange={(v) => updateInfo('website', v)} placeholder="Website" style={{ textAlign: 'center' }} /></div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-10 text-center px-10">
          <div className="text-gray-600 italic leading-loose text-[15px]">
            <EditableField mode={mode} color="#4b5563" font={actualFont} value={data.personalInfo.summary} onChange={(v) => updateInfo('summary', v)} placeholder="Một vài dòng giới thiệu bản thân một cách thanh lịch..." multiline style={{ textAlign: 'center' }} />
          </div>
        </div>

        <div className="flex justify-center items-center w-full mb-10">
          <div className="h-px w-full bg-gray-200"></div>
          <div className="mx-6 text-sm tracking-widest text-gray-400 uppercase whitespace-nowrap">Kinh nghiệm</div>
          <div className="h-px w-full bg-gray-200"></div>
        </div>

        {/* EXPERIENCE */}
        <div className="mb-10">
          <div className="space-y-8">
            {data.experiences.map((exp, index) => (
              <ItemBlock
                key={exp.id} mode={mode}
                onDelete={() => handleDeleteItem('experiences', exp.id)}
                onMoveDown={() => handleMoveItem('experiences', index, 1)}
                canMoveDown={index < data.experiences.length - 1}
                onAdd={() => handleAddItem('experiences', { companyName: 'Tên công ty', jobTitle: 'Vị trí', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
              >
                <div className="text-center">
                  <div className="text-[17px] text-[#2c2c2c] mb-1 tracking-wide">
                    <EditableField mode={mode} color="#2c2c2c" font={actualFont} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Vị trí công việc" style={{ textAlign: 'center' }} />
                  </div>
                  <div className="text-[14px] text-gray-500 mb-3 flex justify-center items-center gap-2">
                    <span className="italic"><EditableField mode={mode} color="#6b7280" font={actualFont} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Tên công ty" className="inline-block" /></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs tracking-wider uppercase">
                      <EditableField mode={mode} color="#6b7280" font={actualFont} value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="Từ" className="inline-block" />
                      <span className="mx-1">-</span>
                      <EditableField mode={mode} color="#6b7280" font={actualFont} value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="Đến" className="inline-block" />
                    </span>
                  </div>
                  <div className="text-gray-600 text-[14.5px] leading-relaxed max-w-[85%] mx-auto">
                    <EditableField mode={mode} color="#4b5563" font={actualFont} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="Mô tả công việc..." multiline style={{ textAlign: 'center' }} />
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.experiences.length === 0 && mode === 'editor' && (
              <div className="text-center"><button onClick={() => handleAddItem('experiences', { companyName: 'Công ty', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-gray-400 italic">+ Thêm kinh nghiệm</button></div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center w-full mb-10">
          <div className="h-px w-full bg-gray-200"></div>
          <div className="mx-6 text-sm tracking-widest text-gray-400 uppercase whitespace-nowrap">Học vấn</div>
          <div className="h-px w-full bg-gray-200"></div>
        </div>

        {/* EDUCATION */}
        <div className="mb-10">
          <div className="space-y-6">
            {data.educations.map((edu, index) => (
              <ItemBlock
                key={edu.id} mode={mode}
                onDelete={() => handleDeleteItem('educations', edu.id)}
                onMoveDown={() => handleMoveItem('educations', index, 1)}
                canMoveDown={index < data.educations.length - 1}
                onAdd={() => handleAddItem('educations', { schoolName: 'Trường học', fieldOfStudy: 'Chuyên ngành', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
              >
                <div className="text-center">
                  <div className="text-[16px] text-[#2c2c2c] mb-1 tracking-wide uppercase">
                    <EditableField mode={mode} color="#2c2c2c" font={actualFont} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="Tên trường học" style={{ textAlign: 'center' }} />
                  </div>
                  <div className="text-[14px] text-gray-500 mb-2 flex justify-center items-center gap-2">
                    <span className="italic"><EditableField mode={mode} color="#6b7280" font={actualFont} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Chuyên ngành / Bằng cấp" className="inline-block" /></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs tracking-wider uppercase">
                      <EditableField mode={mode} color="#6b7280" font={actualFont} value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="Từ" className="inline-block" />
                      <span className="mx-1">-</span>
                      <EditableField mode={mode} color="#6b7280" font={actualFont} value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="Đến" className="inline-block" />
                    </span>
                  </div>
                </div>
              </ItemBlock>
            ))}
            {data.educations.length === 0 && mode === 'editor' && (
              <div className="text-center"><button onClick={() => handleAddItem('educations', { schoolName: 'Trường', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-gray-400 italic">+ Thêm học vấn</button></div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center w-full mb-10">
          <div className="h-px w-full bg-gray-200"></div>
          <div className="mx-6 text-sm tracking-widest text-gray-400 uppercase whitespace-nowrap">Kỹ năng</div>
          <div className="h-px w-full bg-gray-200"></div>
        </div>

        {/* SKILLS */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {data.skills.map((skill, index) => (
              <ItemBlock
                key={skill.id} mode={mode}
                onDelete={() => handleDeleteItem('skills', skill.id)}
                onMoveDown={() => handleMoveItem('skills', index, 1)}
                canMoveDown={index < data.skills.length - 1}
                onAdd={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })}
              >
                <div className="text-center">
                  <div className="text-[15px] tracking-wide text-[#2c2c2c] mb-1">
                    <EditableField mode={mode} color="#2c2c2c" font={actualFont} value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Tên kỹ năng" style={{ textAlign: 'center' }} />
                  </div>
                </div>
              </ItemBlock>
            ))}
            {mode === 'editor' && (
              <button onClick={() => handleAddItem('skills', { name: 'Kỹ năng', description: '' })} className="text-sm text-gray-400 italic">+ Thêm kỹ năng</button>
            )}
          </div>
        </div>

      </div>
    );
  }
);
ElegantTemplate.displayName = 'ElegantTemplate';
