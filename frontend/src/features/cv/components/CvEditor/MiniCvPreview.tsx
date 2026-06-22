import React, { useMemo } from 'react';
import { getTemplateRenderer } from '../../templates/templateRegistry';
import { sampleCvData } from '../../api/sampleCvData';
import { CvData, initialCvData } from '../../types';

interface MiniCvPreviewProps {
  templateStyle: string;
  color?: string;
  scale?: number;
}

/**
 * Renders a real mini CV preview by rendering the actual template component
 * at a very small scale. This gives an authentic preview of what the template
 * actually looks like with real data.
 */
export const MiniCvPreview: React.FC<MiniCvPreviewProps> = ({ templateStyle, color = '#4F46E5', scale = 0.31 }) => {
  const TemplateRenderer = useMemo(() => getTemplateRenderer(templateStyle), [templateStyle]);

  const previewData: CvData = useMemo(() => ({
    ...initialCvData,
    ...sampleCvData,
    id: 'preview',
    templateId: 'preview',
  }), []);

  return (
    <div className="w-full h-full overflow-hidden bg-white">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '794px',       // A4 width in px
          minHeight: '1123px',  // A4 height in px
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <TemplateRenderer
          data={previewData}
          color={color}
          font="Roboto"
          fontSize="medium"
          lineHeight={1.5}
          background="white"
          mode="preview"
        />
      </div>
    </div>
  );
};
