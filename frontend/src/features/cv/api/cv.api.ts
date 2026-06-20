import axiosClient from '@/lib/axios';
import { CvData } from '../types';

export const cvApi = {
  getMyResumes: () => {
    return axiosClient.get('/resumes');
  },
  
  getResumeById: (id: string) => {
    return axiosClient.get(`/resumes/${id}`);
  },
  
  createResume: (data: Partial<CvData>) => {
    const payload = {
      title: data.title || 'CV chưa đặt tên',
      templateId: data.templateId,
      fileUrl: data.fileUrl,
      personalData: data.personalInfo,
    };
    return axiosClient.post('/resumes', payload);
  },
  
  updateResume: (id: string, data: Partial<CvData>) => {
    const payload = {
      title: data.title,
      templateId: data.templateId,
      fileUrl: data.fileUrl,
      personalData: {
        ...data.personalInfo,
        experiences: data.experiences,
        educations: data.educations,
        skills: data.skills,
        certificates: data.certificates,
      }
    };
    return axiosClient.patch(`/resumes/${id}`, payload);
  },
  
  deleteResume: (id: string) => {
    return axiosClient.delete(`/resumes/${id}`);
  },

  uploadCvPdf: (file: File) => {
    const formData = new FormData();
    formData.append('cvFile', file);
    return axiosClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
