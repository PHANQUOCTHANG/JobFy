import React, { forwardRef } from 'react';
import { CvData } from '../../types';
import { getTemplateRenderer } from '../../templates/templateRegistry';

interface CvPreviewProps {
  data: CvData;
  color?: string;
  font?: string;
  fontSize?: 'small' | 'medium' | 'large';
  lineHeight?: number;
  background?: string;
  templateStyle?: string;
}

export const CvPreview = forwardRef<HTMLDivElement, CvPreviewProps>(
  ({ data, color = '#000000', font = 'Roboto', fontSize = 'medium', lineHeight = 1.4, background = 'white', templateStyle = 'Hiện đại' }, ref) => {
    
    const TemplateRenderer = getTemplateRenderer(templateStyle);

    return (
      <TemplateRenderer
        ref={ref}
        data={data}
        color={color}
        font={font}
        fontSize={fontSize}
        lineHeight={lineHeight}
        background={background}
        mode="preview"
      />
    );
  }
);

CvPreview.displayName = 'CvPreview';
