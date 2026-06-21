import { useState, useEffect, useCallback, useRef } from 'react';
import { CvData, initialCvData } from '../types';
import { cvApi } from '../api/cv.api';
import { useQuery } from '@tanstack/react-query';

const STORAGE_KEY = 'jobfy_my_cvs_fallback';

export const useCvEditor = (cvId?: string, initialTemplateId?: string) => {
  const isUuid = cvId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cvId);

  const [cvData, setCvData] = useState<CvData>(() => ({
    ...initialCvData,
    id: cvId || `cv_${Date.now()}`,
    templateId: initialTemplateId || initialCvData.templateId
  }));

  const [isSaved, setIsSaved] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const initialFetchDone = useRef(false);

  // 1. Fetch real data from API if cvId is valid UUID
  const { data: fetchedData, error, isSuccess, isError } = useQuery({
    queryKey: ['resume', cvId],
    queryFn: async () => {
      if (!isUuid) return null;
      const res = await cvApi.getResumeById(cvId!);
      return res.data;
    },
    enabled: !!isUuid && !initialFetchDone.current,
    retry: 1,
  });

  useEffect(() => {
    if (isSuccess && fetchedData) {
      const resume = fetchedData.data;
      // personalData lưu toàn bộ CV data dưới dạng JSON
      const pd = resume.personalData || {};

      setCvData(prev => ({
        ...prev,
        id: resume.id,
        title: resume.title,
        templateId: resume.templateId || initialTemplateId || initialCvData.templateId,
        fileUrl: resume.fileUrl || undefined,
        personalInfo: {
          fullName: pd.fullName || '',
          jobTitle: pd.jobTitle || '',
          email: pd.email || '',
          phone: pd.phone || '',
          address: pd.address || '',
          avatarUrl: pd.avatarUrl || '',
          summary: pd.summary || '',
          linkedin: pd.linkedin || '',
          website: pd.website || '',
          settings: pd.settings || undefined,
        },
        // Ưu tiên lấy từ personalData.experiences (JSON) — đây là cách editor lưu
        // Nếu không có, fallback sang relation tables (resume.experiences từ BE)
        experiences: pd.experiences?.length
          ? pd.experiences
          : (resume.experiences || []).map((e: any) => ({
              id: String(e.id),
              companyName: e.companyName || '',
              jobTitle: e.jobTitle || '',
              startDate: e.startDate ? new Date(e.startDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : '',
              endDate: e.endDate ? new Date(e.endDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : '',
              isCurrent: e.isCurrent || false,
              description: e.description || '',
            })),
        educations: pd.educations?.length
          ? pd.educations
          : (resume.educations || []).map((e: any) => ({
              id: String(e.id),
              schoolName: e.schoolName || '',
              fieldOfStudy: e.fieldOfStudy || '',
              startDate: e.startDate ? new Date(e.startDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : '',
              endDate: e.endDate ? new Date(e.endDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : '',
              isCurrent: e.isCurrent || false,
              description: e.description || '',
            })),
        skills: pd.skills?.length
          ? pd.skills
          : (resume.skills || []).map((s: any) => ({
              id: String(s.id),
              name: s.skill?.name || s.name || '',
              level: s.level ? 4 : undefined,
              description: '',
            })),
        certificates: pd.certificates?.length
          ? pd.certificates
          : (resume.certifications || []).map((c: any) => ({
              id: String(c.id),
              name: c.name || '',
              issuer: c.issuer || '',
              issueDate: c.issueDate ? new Date(c.issueDate).getFullYear().toString() : '',
            })),
      }));
      setIsInitializing(false);
      initialFetchDone.current = true;
    } else if (isError || (isSuccess && !fetchedData && isUuid)) {
      // Fallback to local storage if API fails
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const cvs = JSON.parse(stored);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const found = cvs.find((c: any) => c.id === cvId);
          if (found) setCvData(found);
        }
      // eslint-disable-next-line unused-imports/no-unused-vars
      } catch (e) {}
      setIsInitializing(false);
      initialFetchDone.current = true;
    }
  }, [fetchedData, isSuccess, isError, cvId, isUuid, initialTemplateId]);

  // For non-UUIDs (creating new CV without DB yet)
  useEffect(() => {
    if (!isUuid && !initialFetchDone.current) {
      setIsInitializing(false);
      initialFetchDone.current = true;
    }
  }, [isUuid]);

  const lastSavedData = useRef(cvData);

  // Track unsaved changes
  useEffect(() => {
    if (isInitializing) return;
    if (JSON.stringify(cvData) !== JSON.stringify(lastSavedData.current)) {
      setIsSaved(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData, isInitializing]);

  const markAsSaved = useCallback((newData?: CvData) => {
    lastSavedData.current = newData || cvData;
    setIsSaved(true);
  }, [cvData]);

  const updatePersonalInfo = useCallback((info: Partial<CvData['personalInfo']>) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  }, []);

  const updateArrayField = useCallback(<K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(
    field: K,
    data: CvData[K]
  ) => {
    setCvData(prev => ({
      ...prev,
      [field]: data
    }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setCvData(prev => ({ ...prev, title }));
  }, []);

  const updateTemplate = useCallback((templateId: string) => {
    setCvData(prev => ({ ...prev, templateId }));
  }, []);

  return {
    cvData,
    isSaved,
    markAsSaved,
    isInitializing,
    updatePersonalInfo,
    updateArrayField,
    updateTitle,
    updateTemplate,
    setCvData
  };
};
