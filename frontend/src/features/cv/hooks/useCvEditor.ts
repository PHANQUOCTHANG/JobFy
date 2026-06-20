import { useState, useEffect, useCallback, useRef } from 'react';
import { CvData, initialCvData } from '../types';
import { cvApi } from '../api/cv.api';
import { useQuery, useMutation } from '@tanstack/react-query';

const STORAGE_KEY = 'jobfy_my_cvs_fallback';

export const useCvEditor = (cvId?: string, initialTemplateId?: string) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const isExistingCv = cvId && cvId.includes('-') && cvId.length === 36;

  const [cvData, setCvData] = useState<CvData>(() => ({
    ...initialCvData,
    id: cvId || `cv_${Date.now()}`,
    templateId: initialTemplateId || initialCvData.templateId
  }));

  const [isSaved, setIsSaved] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const initialFetchDone = useRef(false);

  // 1. Fetch real data from API if cvId is valid UUID
  const isUuid = cvId && cvId.includes('-') && cvId.length === 36;

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { data: fetchedData, error, isSuccess, isError } = useQuery({
    queryKey: ['resume', cvId],
    queryFn: async () => {
      if (!isUuid) return null;
      const res = await cvApi.getResumeById(cvId);
      return res.data;
    },
    enabled: !!isUuid && !initialFetchDone.current,
  });

  useEffect(() => {
    if (isSuccess && fetchedData) {
      const resume = fetchedData.data;
      const pd = resume.personalData || {};
      
      setCvData(prev => ({
        ...prev,
        id: resume.id,
        title: resume.title,
        templateId: resume.templateId || initialTemplateId || initialCvData.templateId,
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
        },
        experiences: pd.experiences || [],
        educations: pd.educations || [],
        skills: pd.skills || [],
        certificates: pd.certificates || [],
      }));
      setIsInitializing(false);
      initialFetchDone.current = true;
    } else if (isError || (isSuccess && !fetchedData && isUuid)) {
      // Fallback to local storage if API fails or empty
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

  // For non-UUIDs (e.g. creating a new CV without hitting DB yet)
  useEffect(() => {
    if (!isUuid && !initialFetchDone.current) {
      setIsInitializing(false);
      initialFetchDone.current = true;
    }
  }, [isUuid]);

  // Mutation for saving
  const saveMutation = useMutation({
    mutationFn: async (data: CvData) => {
      if (data.id && data.id.includes('-') && data.id.length === 36) {
        // Đã có UUID → UPDATE
        return cvApi.updateResume(data.id, data);
      } else {
        // Tạo mới qua API → nhận UUID từ server
        const res = await cvApi.createResume(data);
        const responseData = res.data?.data || res.data;
        const newId = responseData?.id;
        if (newId) {
          // Cập nhật state với UUID mới từ server
          setCvData(prev => ({ ...prev, id: newId }));
          // Cập nhật URL mà không reload trang
          window.history.replaceState(
            null, '',
            `/cv/editor/${data.templateId}?id=${newId}`
          );
        }
        return res;
      }
    },
    onSuccess: () => {
      setIsSaved(true);
    }
  });

  // Auto-save debounced
  useEffect(() => {
    if (isInitializing) return;

    const timer = setTimeout(() => {
      saveMutation.mutate(cvData);
    }, 1500);

    setIsSaved(false);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData, isInitializing]);

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
    isInitializing,
    updatePersonalInfo,
    updateArrayField,
    updateTitle,
    updateTemplate,
    setCvData
  };
};
