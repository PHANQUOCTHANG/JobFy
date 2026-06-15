import { useState, useEffect, useCallback } from 'react';
import { CvData, initialCvData } from '../types';

const STORAGE_KEY = 'jobfy_my_cvs';

export const useCvEditor = (cvId?: string, initialTemplateId?: string) => {
  const [cvData, setCvData] = useState<CvData>(() => {
    // If we have an ID, try to load it
    if (cvId) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const cvs: CvData[] = JSON.parse(stored);
          const found = cvs.find(c => c.id === cvId);
          if (found) return found;
        }
      } catch (e) {
        console.error('Failed to load CV from storage', e);
      }
    }
    
    // Otherwise, create a new one
    return {
      ...initialCvData,
      id: cvId || `cv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      templateId: initialTemplateId || initialCvData.templateId
    };
  });

  const [isSaved, setIsSaved] = useState(true);

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCvData(cvData);
      setIsSaved(true);
    }, 1000);

    setIsSaved(false);
    return () => clearTimeout(timer);
  }, [cvData]);

  const saveCvData = useCallback((data: CvData) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let cvs: CvData[] = stored ? JSON.parse(stored) : [];
      
      const index = cvs.findIndex(c => c.id === data.id);
      
      const dataToSave = { ...data, updatedAt: new Date().toISOString() };
      
      if (index >= 0) {
        cvs[index] = dataToSave;
      } else {
        cvs.push(dataToSave);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
    } catch (e) {
      console.error('Failed to save CV to storage', e);
    }
  }, []);

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
    updatePersonalInfo,
    updateArrayField,
    updateTitle,
    updateTemplate,
    setCvData
  };
};
