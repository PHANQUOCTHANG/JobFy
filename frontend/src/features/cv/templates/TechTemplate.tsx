import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Github, Monitor } from 'lucide-react';
import { TemplateRendererProps } from './templateRegistry';
import { EditableField } from './shared/EditableField';
import { SectionBlock } from './shared/SectionBlock';
import { ItemBlock } from './shared/ItemBlock';
import { v4 as uuidv4 } from 'uuid';

export const TechTemplate = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ data, color, font, fontSize, lineHeight, background, mode, onUpdatePersonalInfo, onUpdateArrayField }, ref) => {
    
    // Handlers (same as others)
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
          color: '#334155'
        }}
      >
        <div className="w-full flex items-center p-8 bg-slate-900 text-slate-100">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
            {data.personalInfo.avatarUrl ? (
              <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Monitor className="text-slate-500" size={32} />
            )}
          </div>
          <div className="ml-6 flex-1">
            <div className="text-3xl font-bold tracking-tight text-white mb-1 font-mono">
              <span className="text-blue-400">&gt; </span>
              <EditableField mode={mode} color="#fff" font="'Fira Code', monospace" value={data.personalInfo.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="Full Name" className="inline-block" />
              <span className="animate-pulse">_</span>
            </div>
            <div className="text-[16px] text-slate-300 font-mono mb-4">
              <EditableField mode={mode} color="#cbd5e1" font="'Fira Code', monospace" value={data.personalInfo.jobTitle} onChange={(v) => updateInfo('jobTitle', v)} placeholder="Software Engineer" />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Mail size={14} />
                <EditableField mode={mode} color="#94a3b8" font={font} value={data.personalInfo.email} onChange={(v) => updateInfo('email', v)} placeholder="Email" />
              </div>
              <div className="flex items-center gap-1.5">
                <Phone size={14} />
                <EditableField mode={mode} color="#94a3b8" font={font} value={data.personalInfo.phone} onChange={(v) => updateInfo('phone', v)} placeholder="Phone" />
              </div>
              <div className="flex items-center gap-1.5">
                <Github size={14} />
                <EditableField mode={mode} color="#94a3b8" font={font} value={data.personalInfo.website || ''} onChange={(v) => updateInfo('website', v)} placeholder="GitHub / Portfolio" />
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <EditableField mode={mode} color="#94a3b8" font={font} value={data.personalInfo.address} onChange={(v) => updateInfo('address', v)} placeholder="Location" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-[calc(1123px-160px)]">
          <div className="w-[30%] bg-slate-50 p-6 border-r border-slate-200">
            <div className="mb-8">
              <SectionBlock title="TECH STACK" color="#0f172a" mode={mode} variant="bold-line" titleStyle={{ fontFamily: "'Fira Code', monospace" }} />
              <div className="mt-4 flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <ItemBlock
                    key={skill.id} mode={mode}
                    onDelete={() => handleDeleteItem('skills', skill.id)}
                    onMoveDown={() => handleMoveItem('skills', index, 1)}
                    canMoveDown={index < data.skills.length - 1}
                    onAdd={() => handleAddItem('skills', { name: 'Tech', description: '' })}
                  >
                    <div className="bg-white border border-slate-300 text-slate-700 px-2 py-1 rounded shadow-sm text-[12px] font-mono">
                      <EditableField mode={mode} color="#334155" font="'Fira Code', monospace" value={skill.name} onChange={(v) => handleUpdateItem('skills', index, 'name', v)} placeholder="Tech" />
                    </div>
                  </ItemBlock>
                ))}
                {mode === 'editor' && (
                  <button onClick={() => handleAddItem('skills', { name: 'Tech', description: '' })} className="bg-slate-100 border border-dashed border-slate-400 text-slate-500 px-2 py-1 rounded text-[12px] hover:bg-slate-200">+ Thêm</button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <SectionBlock title="CERTIFICATES" color="#0f172a" mode={mode} variant="bold-line" titleStyle={{ fontFamily: "'Fira Code', monospace" }} />
              <div className="mt-4 space-y-4">
                {data.certificates?.map((cert, index) => (
                  <ItemBlock
                    key={cert.id} mode={mode}
                    onDelete={() => handleDeleteItem('certificates', cert.id)}
                    onMoveDown={() => handleMoveItem('certificates', index, 1)}
                    canMoveDown={index < data.certificates.length - 1}
                    onAdd={() => handleAddItem('certificates', { name: 'Cert', issueDate: 'YYYY', issuer: 'Issuer' })}
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-[13px] leading-tight mb-1">
                        <EditableField mode={mode} color="#1e293b" font={font} value={cert.name} onChange={(v) => handleUpdateItem('certificates', index, 'name', v)} placeholder="Name" />
                      </div>
                      <div className="text-slate-500 text-[12px] flex justify-between">
                        <EditableField mode={mode} color="#64748b" font={font} value={cert.issuer} onChange={(v) => handleUpdateItem('certificates', index, 'issuer', v)} placeholder="Issuer" />
                        <span className="font-mono text-slate-400">
                          <EditableField mode={mode} color="#94a3b8" font="'Fira Code', monospace" value={cert.issueDate} onChange={(v) => handleUpdateItem('certificates', index, 'issueDate', v)} placeholder="YYYY" />
                        </span>
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {mode === 'editor' && (
                  <button onClick={() => handleAddItem('certificates', { name: 'Cert', issueDate: '', issuer: '' })} className="text-[12px] text-blue-600 underline">+ Thêm</button>
                )}
              </div>
            </div>
          </div>

          <div className="w-[70%] p-8">
            <div className="mb-8">
              <SectionBlock title="ABOUT ME" color="#0f172a" mode={mode} variant="bold-line" titleStyle={{ fontFamily: "'Fira Code', monospace" }} />
              <div className="mt-4 text-slate-600 leading-relaxed text-[14.5px]">
                <EditableField mode={mode} color="#475569" font={font} value={data.personalInfo.summary} onChange={(v) => updateInfo('summary', v)} placeholder="Write something about your technical background..." multiline />
              </div>
            </div>

            <div className="mb-8">
              <SectionBlock title="EXPERIENCE" color="#0f172a" mode={mode} variant="bold-line" titleStyle={{ fontFamily: "'Fira Code', monospace" }} />
              <div className="mt-4 space-y-6">
                {data.experiences.map((exp, index) => (
                  <ItemBlock
                    key={exp.id} mode={mode}
                    onDelete={() => handleDeleteItem('experiences', exp.id)}
                    onMoveDown={() => handleMoveItem('experiences', index, 1)}
                    canMoveDown={index < data.experiences.length - 1}
                    onAdd={() => handleAddItem('experiences', { companyName: 'Company', jobTitle: 'Role', startDate: 'YYYY', endDate: 'YYYY', description: '' })}
                  >
                    <div className="border-l-2 border-slate-200 pl-4 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-slate-400 -left-[5px] top-1.5"></div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-[16px] text-slate-800">
                          <EditableField mode={mode} color="#1e293b" font={font} value={exp.jobTitle} onChange={(v) => handleUpdateItem('experiences', index, 'jobTitle', v)} placeholder="Role" />
                        </div>
                        <div className="text-[12px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <EditableField mode={mode} color="#64748b" font="'Fira Code', monospace" value={exp.startDate} onChange={(v) => handleUpdateItem('experiences', index, 'startDate', v)} placeholder="From" className="inline-block" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color="#64748b" font="'Fira Code', monospace" value={exp.endDate} onChange={(v) => handleUpdateItem('experiences', index, 'endDate', v)} placeholder="To" className="inline-block" />
                        </div>
                      </div>
                      <div className="text-slate-600 font-medium text-[14px] mb-2 flex items-center">
                        <span style={{ fontSize: '0.85em', color: color, opacity: 0.9 }}>{exp.startDate}</span>
                        <EditableField mode={mode} color="#475569" font={font} value={exp.companyName} onChange={(v) => handleUpdateItem('experiences', index, 'companyName', v)} placeholder="Company" />
                      </div>
                      <div className="text-slate-600 text-[14px] leading-relaxed">
                        <EditableField mode={mode} color="#475569" font={font} value={exp.description} onChange={(v) => handleUpdateItem('experiences', index, 'description', v)} placeholder="- Implemented feature X using React..." multiline />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {mode === 'editor' && (
                  <button onClick={() => handleAddItem('experiences', { companyName: '', jobTitle: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-600 underline ml-4">+ Thêm</button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <SectionBlock title="EDUCATION" color="#0f172a" mode={mode} variant="bold-line" titleStyle={{ fontFamily: "'Fira Code', monospace" }} />
              <div className="mt-4 space-y-4">
                {data.educations.map((edu, index) => (
                  <ItemBlock
                    key={edu.id} mode={mode}
                    onDelete={() => handleDeleteItem('educations', edu.id)}
                    onMoveDown={() => handleMoveItem('educations', index, 1)}
                    canMoveDown={index < data.educations.length - 1}
                    onAdd={() => handleAddItem('educations', { schoolName: 'University', fieldOfStudy: 'Degree', startDate: 'YYYY', endDate: 'YYYY', description: '' })}
                  >
                    <div className="border-l-2 border-slate-200 pl-4 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-slate-400 -left-[5px] top-1.5"></div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-[15px] text-slate-800">
                          <EditableField mode={mode} color="#1e293b" font={font} value={edu.schoolName} onChange={(v) => handleUpdateItem('educations', index, 'schoolName', v)} placeholder="University" />
                        </div>
                        <div className="text-[12px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <EditableField mode={mode} color="#64748b" font="'Fira Code', monospace" value={edu.startDate} onChange={(v) => handleUpdateItem('educations', index, 'startDate', v)} placeholder="From" className="inline-block" />
                          <span className="mx-1">-</span>
                          <EditableField mode={mode} color="#64748b" font="'Fira Code', monospace" value={edu.endDate} onChange={(v) => handleUpdateItem('educations', index, 'endDate', v)} placeholder="To" className="inline-block" />
                        </div>
                      </div>
                      <div className="text-slate-600 font-medium text-[14px]">
                        <EditableField mode={mode} color="#475569" font={font} value={edu.fieldOfStudy} onChange={(v) => handleUpdateItem('educations', index, 'fieldOfStudy', v)} placeholder="Degree" />
                      </div>
                    </div>
                  </ItemBlock>
                ))}
                {mode === 'editor' && (
                  <button onClick={() => handleAddItem('educations', { schoolName: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} className="text-sm text-blue-600 underline ml-4">+ Thêm</button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
);
TechTemplate.displayName = 'TechTemplate';
