import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';
import { SkillSuggestionChips } from '../../ai/components/SkillSuggestionChips';
import { Sparkles, Loader2 } from 'lucide-react';

export const ModernTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ data, color, font, fontSize, lineHeight, background, mode, onUpdatePersonalInfo, onUpdateArrayField, onGenerateSummary, isGeneratingSummary, onSuggestSkills, isSuggestingSkills, suggestedSkills, onAddSuggestedSkill }, ref) => {
    
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
        <div className="flex">
          <div className="w-[35%] bg-gray-50 flex flex-col pt-8 pb-8 px-6 min-h-[1123px]">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-sm mb-6 flex-shrink-0 bg-gray-200">
              {data.personalInfo.avatarUrl ? (
                <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Ảnh 3x4</div>
              )}
            </div>

            <div className="mb-6">
              <SectionBlock title="THÔNG TIN LIÊN HỆ" color={color} mode={mode} />
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <Phone size={14} className="mt-1" style={{ color }} />
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="Số điện thoại" className="flex-1" />
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={14} className="mt-1" style={{ color }} />
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" className="flex-1" />
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-1" style={{ color }} />
                  <EditableField mode={mode} color={color} font={font} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Địa chỉ" className="flex-1" />
                </div>
                {data.personalInfo.website && (
                  <div className="flex items-start gap-2">
                    <Globe size={14} className="mt-1" style={{ color }} />
                    <EditableField mode={mode} color={color} font={font} value={data.personalInfo.website} onChange={(v) => updateInfo('website', v)} placeholder="Website / Link" className="flex-1" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <SectionBlock title="KỸ NĂNG" color={color} mode={mode} />
              <div className="mt-3">
                {data.skills.map((skill, index) => (
                  <ItemBlock
                    key={skill.id} mode={mode}
                    onDelete={() => handleDeleteItem('skills', skill.id)}
                    onMoveDown={() => handleMoveItem('skills', index, 1)}
                    canMoveDown={index < data.skills.length - 1}
                    onAdd={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })}
                  >
                    <div className="mb-2">
                      <div className="font-semibold text-gray-800 text-[14px]">
                        <EditableField mode={mode} color={color} font={font} value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Tên kỹ năng" />
                      </div>
                      <div className="text-gray-600 text-[13px]">
                        <EditableField mode={mode} color={color} font={font} value={skill.description || ''} onChange={(v) => handleUpdateItem('skills', index, 'description', v)} placeholder="Mô tả chi tiết kỹ năng" multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.skills.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('skills', { name: 'Kỹ năng mới', description: '' })} className="text-sm text-blue-500 underline mt-2 mr-4">+ Thêm kỹ năng</button>
                )}
                {mode === 'editor' && (
                  <>
                    <button 
                      onClick={onSuggestSkills}
                      disabled={isSuggestingSkills}
                      className={`inline-flex items-center gap-1 mt-2 text-[13px] font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded border border-purple-200 hover:bg-purple-100 transition-colors ${isSuggestingSkills ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSuggestingSkills ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                      Gợi ý kỹ năng
                    </button>
                    <SkillSuggestionChips 
                      skills={suggestedSkills || []} 
                      onAdd={(skill) => onAddSuggestedSkill && onAddSuggestedSkill(skill)} 
                      onDismiss={() => {}} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-[65%] pt-10 pb-8 px-8">
            <div className="mb-8">
              <div className="text-3xl font-bold uppercase mb-1" style={{ color }}>
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="HỌ VÀ TÊN" />
              </div>
              <div className="text-lg font-medium text-gray-600 uppercase tracking-widest">
                <EditableField mode={mode} color={color} font={font} value={data.personalInfo.jobTitle} onChange={(v) => updateInfo('jobTitle', v)} placeholder="VỊ TRÍ ỨNG TUYỂN" />
              </div>
            </div>

            <div className="mb-6">
              <SectionBlock title="MỤC TIÊU NGHỀ NGHIỆP" color={color} mode={mode} />
              <div className="mt-3 text-gray-700">
                <EditableField 
                  mode={mode} 
                  color={color} 
                  font={font} 
                  value={data.personalInfo.summary} 
                  onChange={(v) => updateInfo('summary', v)} 
                  placeholder="Giới thiệu bản thân và mục tiêu nghề nghiệp..." 
                  multiline 
                  showAiButton={true}
                  onAiClick={onGenerateSummary}
                  isAiLoading={isGeneratingSummary}
                />
              </div>
            </div>

            <div className="mb-6">
              <SectionBlock title="HỌC VẤN" color={color} mode={mode} />
              <div className="mt-3">
                {data.educations.map((edu, index) => (
                  <ItemBlock
                    key={edu.id} mode={mode}
                    onDelete={() => handleDeleteItem('educations', edu.id)}
                    onMoveDown={() => handleMoveItem('educations', index, 1)}
                    canMoveDown={index < data.educations.length - 1}
                    onAdd={() => handleAddItem('educations', { schoolName: 'Tên trường học', fieldOfStudy: 'Chuyên ngành', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
                  >
                    <div className="mb-3">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <div className="font-semibold text-gray-800 text-[15px] uppercase">
                          <EditableField mode={mode} color={color} font={font} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="Tên trường học" />
                        </div>
                        <div className="text-gray-500 text-[13px] italic whitespace-nowrap ml-4">
                          <EditableField mode={mode} color={color} font={font} value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="Bắt đầu" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color={color} font={font} value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="Kết thúc" />
                        </div>
                      </div>
                      <div className="text-[14px] text-gray-700 font-medium mb-1" style={{ color }}>
                        <EditableField mode={mode} color={color} font={font} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Chuyên ngành / Bằng cấp" />
                      </div>
                      <div className="text-gray-600">
                        <EditableField mode={mode} color={color} font={font} value={edu.description} onChange={(v) => handleUpdateItem('educations', index, 'description', v)} placeholder="Chi tiết học vấn..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.educations.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('educations', { schoolName: 'Trường mới', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mt-2">+ Thêm học vấn</button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <SectionBlock title="KINH NGHIỆM LÀM VIỆC" color={color} mode={mode} />
              <div className="mt-3">
                {data.experiences.map((exp, index) => (
                  <ItemBlock
                    key={exp.id} mode={mode}
                    onDelete={() => handleDeleteItem('experiences', exp.id)}
                    onMoveDown={() => handleMoveItem('experiences', index, 1)}
                    canMoveDown={index < data.experiences.length - 1}
                    onAdd={() => handleAddItem('experiences', { companyName: 'Tên công ty', jobTitle: 'Vị trí công việc', startDate: 'MM/YYYY', endDate: 'MM/YYYY', description: '' })}
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <div className="font-semibold text-gray-800 text-[15px] uppercase">
                          <EditableField mode={mode} color={color} font={font} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Tên công ty" />
                        </div>
                        <div className="text-gray-500 text-[13px] italic whitespace-nowrap ml-4">
                          <EditableField mode={mode} color={color} font={font} value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="Bắt đầu" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color={color} font={font} value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="Kết thúc" />
                        </div>
                      </div>
                      <div className="text-[14px] text-gray-700 font-medium mb-1" style={{ color }}>
                        <EditableField mode={mode} color={color} font={font} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Vị trí công việc" />
                      </div>
                      <div className="text-gray-600 text-[13.5px]">
                        <EditableField mode={mode} color={color} font={font} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="Mô tả chi tiết công việc..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {data.experiences.length === 0 && mode === 'editor' && (
                  <button onClick={() => handleAddItem('experiences', { companyName: 'Công ty mới', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-500 underline mt-2">+ Thêm kinh nghiệm</button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <SectionBlock title="CHỨNG CHỈ" color={color} mode={mode} />
              <div className="mt-3">
                {data.certificates?.map((cert, index) => (
                  <ItemBlock
                    key={cert.id} mode={mode}
                    onDelete={() => handleDeleteItem('certificates', cert.id)}
                    onMoveDown={() => handleMoveItem('certificates', index, 1)}
                    canMoveDown={index < data.certificates.length - 1}
                    onAdd={() => handleAddItem('certificates', { name: 'Tên chứng chỉ', issueDate: 'YYYY', issuer: 'Tổ chức cấp' })}
                  >
                    <div className="mb-2 flex items-start gap-3">
                      <div className="text-gray-500 text-[13px] w-12 pt-0.5">
                        <EditableField mode={mode} color={color} font={font} value={cert.issueDate} onChange={(v) => handleUpdateItem('certificates', index, 'issueDate', v)} placeholder="Năm" />
                      </div>
                      <div className="flex-1 border-l-2 border-gray-200 pl-3">
                        <div className="font-medium text-gray-800 text-[14px]">
                          <EditableField mode={mode} color={color} font={font} value={cert.name} onChange={(v) => handleUpdateItem('certificates', index, 'name', v)} placeholder="Tên chứng chỉ" />
                        </div>
                        <div className="text-gray-500 text-[13px]">
                          <EditableField mode={mode} color={color} font={font} value={cert.issuer} onChange={(v) => handleUpdateItem('certificates', index, 'issuer', v)} placeholder="Tổ chức cấp" />
                        </div>
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {(!data.certificates || data.certificates.length === 0) && mode === 'editor' && (
                  <button onClick={() => handleAddItem('certificates', { name: 'Chứng chỉ mới', issueDate: '', issuer: '' })} className="text-sm text-blue-500 underline mt-2">+ Thêm chứng chỉ</button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
);
ModernTemplate.displayName = 'ModernTemplate';
