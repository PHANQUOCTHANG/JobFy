import React, { forwardRef } from 'react';
import { CvData } from '../../types';
import { getTemplateRenderer } from '../../templates/templateRegistry';

interface InlineCvEditorProps {
  data: CvData;
  color: string;
  font?: string;
  fontSize?: 'small' | 'medium' | 'large';
  lineHeight?: number;
  background?: string;
  templateStyle?: string;
  onUpdatePersonalInfo: (info: Partial<CvData['personalInfo']>) => void;
  onUpdateArrayField: <K extends 'experiences' | 'educations' | 'skills' | 'certificates'>(
    field: K,
    data: CvData[K]
  ) => void;
}

export const InlineCvEditor = forwardRef<HTMLDivElement, InlineCvEditorProps>(
  ({ data, color, font = 'Roboto', fontSize = 'medium', lineHeight = 1.5, background = 'white', templateStyle = 'Hiện đại', onUpdatePersonalInfo, onUpdateArrayField }, ref) => {
    
    const TemplateRenderer = getTemplateRenderer(templateStyle);

    return (
      <div className="relative">
        {/* Tip banner */}
        <div style={{ background: '#dcfce7', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#166534', position: 'relative' }}>
          <span>💡 Gợi ý: Các mục có viền nét đứt khi click vào để sửa. Di chuột vào tiêu đề để kéo thả hoặc thêm/xóa mục.</span>
        </div>
        
        <TemplateRenderer
          ref={ref}
          data={data}
          color={color}
          font={font}
          fontSize={fontSize}
          lineHeight={lineHeight}
          background={background}
          mode="editor"
          onUpdatePersonalInfo={onUpdatePersonalInfo}
          onUpdateArrayField={onUpdateArrayField}
        />
      </div>
    );
  }
);

InlineCvEditor.displayName = 'InlineCvEditor';
