import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, Briefcase, GraduationCap, Clock,
  MapPin, Calendar, Star, ExternalLink, Shield, ChevronRight
} from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Job } from '../types';
import { cn } from '@/lib/utils';

interface JobDetailSidebarProps {
  job: Job;
  applicationStatus?: any;
  isLoadingStatus: boolean;
  onApplyClick: () => void;
}

const PRIMARY_COLOR = '#4F46E5';

const EXPERIENCE_LABEL: Record<string, string> = {
  intern: 'Thực tập sinh',
  fresher: 'Không yêu cầu',
  junior: 'Dưới 1 năm',
  mid: '1 - 3 năm',
  senior: '3 - 5 năm',
  lead: '5 - 7 năm',
  manager: 'Trên 7 năm',
};

const JOB_TYPE_LABEL: Record<string, string> = {
  full_time: 'Toàn thời gian',
  part_time: 'Bán thời gian',
  contract: 'Hợp đồng',
  internship: 'Thực tập',
  freelance: 'Freelance',
  remote: 'Remote',
};

const COMPANY_SIZE_LABEL: Record<string, string> = {
  '1_10': '1 - 10 nhân viên',
  '11_50': '11 - 50 nhân viên',
  '51_200': '51 - 200 nhân viên',
  '201_500': '201 - 500 nhân viên',
  '500_1000': '500 - 1000 nhân viên',
  '1000_plus': '5000+ nhân viên',
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="font-semibold text-gray-900 text-sm">{value}</div>
    </div>
  </div>
);

export const JobDetailSidebar: React.FC<JobDetailSidebarProps> = ({
  job,
  applicationStatus,
  isLoadingStatus,
  onApplyClick,
}) => {
  const daysLeft = job.expiresAt
    ? differenceInDays(new Date(job.expiresAt), new Date())
    : null;
  const deadlineStr = job.expiresAt
    ? format(new Date(job.expiresAt), 'dd/MM/yyyy', { locale: vi })
    : null;

  return (
    <div className="space-y-4">

      {/* ── Company Card ───────────────────────────────────── */}
      {job.company && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="w-14 h-14 border border-gray-200 rounded-md flex items-center justify-center p-1.5 flex-shrink-0 bg-white">
              {job.company.logoUrl
                ? <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                : <Building2 className="w-8 h-8 text-gray-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={`/companies/${job.company.slug}`}
                className="font-bold text-gray-900 text-sm hover:text-[#4F46E5] transition-colors line-clamp-2 leading-snug"
              >
                {job.company.name}
              </Link>
              {job.company.avgRating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-500">{job.company.avgRating}</span>
                  {job.company.totalReviews && (
                    <span className="text-xs text-gray-400">({job.company.totalReviews} đánh giá)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-0">
            {job.company.size && (
              <div className="flex items-center gap-3 py-2.5 text-sm border-b border-gray-100">
                <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 w-20 flex-shrink-0 text-xs">Quy mô:</span>
                <span className="font-medium text-gray-800 text-xs">
                  {COMPANY_SIZE_LABEL[job.company.size] || job.company.size}
                </span>
              </div>
            )}
            {job.category?.name && (
              <div className="flex items-center gap-3 py-2.5 text-sm border-b border-gray-100">
                <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 w-20 flex-shrink-0 text-xs">Lĩnh vực:</span>
                <span className="font-medium text-gray-800 text-xs">{job.category.name}</span>
              </div>
            )}
            {job.address && (
              <div className="flex items-start gap-3 py-2.5 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 w-20 flex-shrink-0 text-xs">Địa điểm:</span>
                <span className="font-medium text-gray-800 text-xs leading-relaxed line-clamp-2">{job.address}</span>
              </div>
            )}
          </div>

          <Link
            to={`/companies/${job.company.slug}`}
            style={{ color: PRIMARY_COLOR }}
            className="flex items-center gap-1.5 text-sm font-semibold mt-4 hover:underline"
          >
            Xem trang công ty <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Thông tin chung ────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="font-bold text-gray-900 text-base mb-3">Thông tin chung</h3>

        <div className="divide-y divide-gray-100">
          <InfoRow
            icon={<Briefcase className="w-4 h-4" />}
            label="Cấp bậc"
            value={job.experienceLevel ? (job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)) : 'Nhân viên'}
          />
          <InfoRow
            icon={<GraduationCap className="w-4 h-4" />}
            label="Học vấn"
            value="Không yêu cầu"
          />
          <InfoRow
            icon={<Users className="w-4 h-4" />}
            label="Số lượng tuyển"
            value={job.quantity ? `${job.quantity} người` : 'Không giới hạn'}
          />
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="Hình thức làm việc"
            value={JOB_TYPE_LABEL[job.jobType] || 'Toàn thời gian'}
          />
          <InfoRow
            icon={<Building2 className="w-4 h-4" />}
            label="Loại hình làm việc"
            value={job.isRemote ? 'Remote / Tại nhà' : 'Làm việc tại văn phòng'}
          />
        </div>
      </div>

      {/* ── Deadline countdown ─────────────────────────────── */}
      {deadlineStr && (
        <div
          className={cn(
            'bg-white rounded-lg shadow-sm p-4 flex items-center gap-3',
            daysLeft !== null && daysLeft <= 3 && 'border border-red-200'
          )}
        >
          <Calendar className={cn('w-5 h-5 flex-shrink-0', daysLeft !== null && daysLeft <= 3 ? 'text-red-500' : 'text-gray-400')} />
          <div>
            <div className="text-xs text-gray-500">Hạn nộp hồ sơ</div>
            <div className={cn('font-bold text-sm', daysLeft !== null && daysLeft <= 3 ? 'text-red-500' : 'text-gray-900')}>
              {deadlineStr}
              {daysLeft !== null && daysLeft >= 0 && (
                <span className="font-normal text-xs ml-1 text-gray-500">(Còn {daysLeft} ngày)</span>
              )}
              {daysLeft !== null && daysLeft < 0 && (
                <span className="font-normal text-xs ml-1 text-red-500">(Đã hết hạn)</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-around text-center">
        <div>
          <div className="text-lg font-bold text-gray-900">{(job.viewCount || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500">Lượt xem</div>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div>
          <div className="text-lg font-bold text-gray-900">{(job.applyCount || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500">Ứng tuyển</div>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div>
          <div className="text-lg font-bold text-gray-900">{(job.saveCount || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500">Lưu tin</div>
        </div>
      </div>

      {/* ── Safety tips ────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4" style={{ borderLeftColor: PRIMARY_COLOR }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
          <span className="text-sm font-bold text-gray-800">Bí kíp tìm việc an toàn</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          JobFy luôn đặt sự an toàn của bạn lên hàng đầu. Hãy cẩn thận với các tin tuyển dụng yêu cầu đóng phí hay cung cấp thông tin ngân hàng.
        </p>
      </div>

    </div>
  );
};
