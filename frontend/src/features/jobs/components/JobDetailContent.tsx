import React from 'react';
import { Job } from '../types';
import { MapPin } from 'lucide-react';

interface JobDetailContentProps {
  job: Job;
}

const PRIMARY_COLOR = '#4F46E5';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
      <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: PRIMARY_COLOR }}></span>
      {title}
    </h3>
    {children}
  </div>
);

export const JobDetailContent: React.FC<JobDetailContentProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="font-bold text-gray-900 text-lg mb-5 pb-4 border-b border-gray-100 flex items-center justify-between">
        <span>Chi tiết tin tuyển dụng</span>
      </h2>

      {job.jobSkills && job.jobSkills.length > 0 && (
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {job.jobSkills.map((js) => (
              <span
                key={js.id}
                className="inline-block px-3 py-1 text-sm rounded border border-gray-200 text-gray-700 bg-gray-50 hover:border-indigo-400 hover:text-indigo-700 transition-colors cursor-default"
              >
                {js.skill?.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.description && (
        <Section title="Mô tả công việc">
          <div
            className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none
              [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
              [&_ol]:list-decimal [&_ol]:pl-5
              [&_p]:mb-3 [&_strong]:text-gray-900 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </Section>
      )}

      {job.requirements && (
        <Section title="Yêu cầu ứng viên">
          <div
            className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none
              [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
              [&_ol]:list-decimal [&_ol]:pl-5
              [&_p]:mb-3 [&_strong]:text-gray-900 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: job.requirements }}
          />
        </Section>
      )}

      {job.benefits && (
        <Section title="Quyền lợi">
          <div
            className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none
              [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
              [&_ol]:list-decimal [&_ol]:pl-5
              [&_p]:mb-3 [&_strong]:text-gray-900 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: job.benefits }}
          />
        </Section>
      )}

      <Section title="Địa điểm làm việc">
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span>{job.address || 'Đang cập nhật địa điểm'}</span>
        </div>
        <div className="mt-3 w-full h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          />
          <span className="text-gray-400 text-xs z-10 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Bản đồ đang cập nhật
          </span>
        </div>
      </Section>

      {job.isRemote && (
        <Section title="Thời gian làm việc">
          <p className="text-sm text-gray-700">Làm việc từ xa (Remote) – Linh hoạt theo thỏa thuận.</p>
        </Section>
      )}

      <Section title="Cách thức ứng tuyển">
        <p className="text-sm text-gray-700">
          Ứng viên nộp hồ sơ trực tuyến bằng cách bấm{' '}
          <strong style={{ color: PRIMARY_COLOR }}>Ứng tuyển ngay</strong> ngay dưới đây.
        </p>
      </Section>
    </div>
  );
};
