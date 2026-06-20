import React from 'react';
import { CvData } from '../types';

import { ModernTemplate } from './ModernTemplate';
import { SimpleTemplate } from './SimpleTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { HarvardTemplate } from './HarvardTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { TechTemplate } from './TechTemplate';
import { ElegantTemplate } from './ElegantTemplate';

export interface TemplateRendererProps {
  data: CvData;
  color: string;
  font: string;
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: number;
  background: string;
  mode: 'editor' | 'preview';
  onUpdatePersonalInfo?: (info: Partial<CvData['personalInfo']>) => void;
  onUpdateArrayField?: <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(
    field: K, data: CvData[K]
  ) => void;
}

export type TemplateComponent = React.ForwardRefExoticComponent<TemplateRendererProps & React.RefAttributes<HTMLDivElement>>;

const registry = new Map<string, TemplateComponent>();
export const availableTemplates = () => Array.from(registry.keys());

export function registerTemplate(style: string, component: TemplateComponent): void {
  registry.set(style, component);
}

// Pre-register all available templates
registerTemplate('Hiện đại', ModernTemplate);
registerTemplate('Đơn giản', SimpleTemplate);
registerTemplate('Sáng tạo', CreativeTemplate);
registerTemplate('Harvard', HarvardTemplate);
registerTemplate('Chuyên nghiệp', ExecutiveTemplate);
registerTemplate('Tối giản', MinimalistTemplate);
registerTemplate('Công nghệ', TechTemplate);
registerTemplate('Thanh lịch', ElegantTemplate);

export function getTemplateRenderer(style: string): TemplateComponent {
  const component = registry.get(style);
  if (!component) {
    console.warn(`Template style "${style}" not found, falling back to "Hiện đại"`);
    return registry.get('Hiện đại')!;
  }
  return component;
}
