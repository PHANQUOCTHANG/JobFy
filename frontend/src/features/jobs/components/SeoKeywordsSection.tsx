import React from 'react';
import { Link } from 'react-router-dom';

export const SeoKeywordsSection: React.FC = () => {
  const jobTags = [
    'Việc làm IT', 'Việc làm Kế toán', 'Việc làm Marketing', 'Việc làm Kinh doanh',
    'Việc làm Sinh viên mới ra trường', 'Việc làm Bán thời gian', 'Việc làm Remote',
    'Việc làm Tiếng Anh', 'Việc làm Tiếng Nhật', 'Thực tập sinh', 'Tuyển dụng',
    'Việc làm Hà Nội', 'Việc làm TP.HCM', 'Việc làm Đà Nẵng', 'Việc làm Cần Thơ'
  ];

  return (
    <div className="py-8 border-t border-gray-200 mt-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-[18px] font-bold text-[#212f3f] mb-4">
          Từ khóa tìm việc phổ biến
        </h2>
        <div className="flex flex-wrap gap-2">
          {jobTags.map((tag, index) => (
            <Link 
              key={index}
              to={`/jobs?keyword=${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 bg-[#f4f5f5] text-sm text-gray-600 rounded hover:bg-blue-50 hover:text-[#4F46E5] transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500 leading-relaxed">
          <h3 className="font-bold text-gray-700 mb-2">Tìm việc làm hiệu quả cùng JobFy</h3>
          <p className="mb-3">
            JobFy là nền tảng công nghệ tuyển dụng hàng đầu, giúp bạn dễ dàng tìm kiếm việc làm phù hợp với năng lực và định hướng phát triển sự nghiệp. Hàng ngàn cơ hội việc làm hấp dẫn từ các công ty uy tín đang chờ đón bạn.
          </p>
          <p>
            Đừng quên sử dụng <Link to="/cv" className="text-[#4F46E5] hover:underline">Trình tạo CV</Link> chuẩn xác của chúng tôi để nâng cao cơ hội được gọi phỏng vấn. Hệ thống tự động gợi ý các mẫu CV phù hợp với từng ngành nghề, giúp bạn gây ấn tượng mạnh mẽ với nhà tuyển dụng.
          </p>
        </div>
      </div>
    </div>
  );
};
