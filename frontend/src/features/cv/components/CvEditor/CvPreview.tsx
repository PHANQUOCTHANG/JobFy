import React, { forwardRef } from 'react';
import { CvData } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CvPreviewProps {
  data: CvData;
  color?: string;
  templateStyle?: string;
}

export const CvPreview = forwardRef<HTMLDivElement, CvPreviewProps>(({ data, color = '#4F46E5', templateStyle = 'Hiện đại' }, ref) => {
  const { personalInfo, experiences, educations, skills } = data;

  // Render based on templateStyle (simplified for now to a generic, clean modern look)
  // We can expand this later with switch cases for 'Harvard', 'Đơn giản', etc.

  const renderContactItem = (icon: React.ReactNode, text: string | undefined) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-2 text-sm mb-1">
        <span style={{ color }}>{icon}</span>
        <span>{text}</span>
      </div>
    );
  };

  return (
    <div 
      ref={ref} 
      className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-sm overflow-hidden"
      style={{ boxSizing: 'border-box' }}
    >
      <div className="flex h-full min-h-[297mm]">
        {/* Left Column (1/3) */}
        <div className="w-[35%] p-8 text-white" style={{ backgroundColor: color }}>
          {/* Avatar Placeholder if none */}
          <div className="w-40 h-40 bg-white/20 rounded-full mx-auto mb-6 border-4 border-white/30 overflow-hidden flex items-center justify-center">
            {personalInfo.avatarUrl ? (
              <img src={personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/50 font-medium">Avatar</span>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold border-b border-white/30 pb-2 mb-4 uppercase tracking-wider">Liên hệ</h2>
            <div className="space-y-3">
              {renderContactItem(<Phone size={16} className="text-white" />, personalInfo.phone || '0123 456 789')}
              {renderContactItem(<Mail size={16} className="text-white" />, personalInfo.email || 'email@example.com')}
              {renderContactItem(<MapPin size={16} className="text-white" />, personalInfo.address || 'Địa chỉ của bạn')}
              {renderContactItem(<Globe size={16} className="text-white" />, personalInfo.website)}
              {renderContactItem(<Linkedin size={16} className="text-white" />, personalInfo.linkedin)}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold border-b border-white/30 pb-2 mb-4 uppercase tracking-wider">Kỹ năng</h2>
            <div className="space-y-3">
              {skills.length > 0 ? (
                skills.map(skill => (
                  <div key={skill.id}>
                    <div className="text-sm mb-1">{skill.name}</div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full" 
                        style={{ width: `${(skill.level || 0) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/50 text-sm italic">Chưa có kỹ năng</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (2/3) */}
        <div className="w-[65%] p-8 bg-white text-gray-800">
          <div className="mb-8">
            <h1 className="text-4xl font-bold uppercase mb-2" style={{ color }}>
              {personalInfo.fullName || 'Họ và Tên'}
            </h1>
            <div className="text-xl text-gray-500 uppercase tracking-widest font-medium">
              {personalInfo.jobTitle || 'Vị trí ứng tuyển'}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4 uppercase flex items-center gap-2" style={{ borderColor: color, color }}>
              Mục tiêu nghề nghiệp
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
              {personalInfo.summary || 'Giới thiệu ngắn gọn về bản thân và mục tiêu nghề nghiệp...'}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4 uppercase flex items-center gap-2" style={{ borderColor: color, color }}>
              Kinh nghiệm làm việc
            </h2>
            <div className="space-y-6">
              {experiences.length > 0 ? (
                experiences.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{exp.position}</h3>
                      <div className="text-sm font-medium" style={{ color }}>
                        {exp.startDate} - {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                      </div>
                    </div>
                    <div className="text-md font-semibold text-gray-600 mb-2">{exp.company}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap pl-4 border-l-2" style={{ borderColor: `${color}40` }}>
                      {exp.description}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">Chưa có kinh nghiệm làm việc</div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4 uppercase flex items-center gap-2" style={{ borderColor: color, color }}>
              Học vấn
            </h2>
            <div className="space-y-4">
              {educations.length > 0 ? (
                educations.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{edu.major}</h3>
                      <div className="text-sm font-medium" style={{ color }}>
                        {edu.startDate} - {edu.isCurrent ? 'Hiện tại' : edu.endDate}
                      </div>
                    </div>
                    <div className="text-md font-semibold text-gray-600 mb-1">{edu.school}</div>
                    {edu.description && (
                      <div className="text-sm text-gray-600 whitespace-pre-wrap">
                        {edu.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">Chưa có thông tin học vấn</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

CvPreview.displayName = 'CvPreview';
