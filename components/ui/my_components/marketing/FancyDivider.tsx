import React from 'react';
import ImageWrapper from './ImageWrapper';

interface FancyDividerProps {
  pdfMode?: boolean;
}

const FancyDivider = ({ pdfMode = false }: FancyDividerProps) => {
  return (
    <div
      className={`flex items-center justify-center ${pdfMode ? "footer" : ""}`}
      // For PDF mode, we add extra margin so it’s not flush with the content above
      style={{ marginTop: pdfMode ? "40px" : "100px", marginBottom: "24px" }}
    >
      <div
        className="w-3/4 relative"
        // Force the border style inline so it appears reliably
        style={{ borderTop: "2px solid #d1d5db" }}
      >
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-background px-3"
          style={{ top: pdfMode ? "-20px" : "-20px" }}
        >
          <ImageWrapper 
            src="/images/branding/icons/flowerBlack.ico"
            alt="Divider Icon"
            width={24}
            height={24}
            pdfMode={pdfMode}
            className="w-8 h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default FancyDivider;
