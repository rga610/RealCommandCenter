// components/ui/my_components/marketing/ImageWrapper.tsx
import React from 'react';

export interface ImageWrapperProps {
  src: string | { src: string };
  alt: string;
  width: number;
  height: number;
  pdfMode?: boolean;
  fill?: boolean; // if true, image will fill its container (object-fit: cover)
  className?: string;
  style?: React.CSSProperties;
  // Allow additional props
  [x: string]: any;
}

const ImageWrapper = ({
  src,
  alt,
  width,
  height,
  pdfMode = false,
  fill = false,
  className,
  style,
  ...rest
}: ImageWrapperProps) => {
  // Helper to extract URL string whether src is a string or an object
  const extractUrl = (src: string | { src: string }): string => {
    if (typeof src === 'object' && src.src) {
      return src.src;
    }
    return src as string;
  };

  const imagePath = extractUrl(src);

  if (pdfMode) {
    // Convert relative URLs to absolute using NEXT_PUBLIC_BASE_URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const absoluteSrc = imagePath.startsWith('/') ? baseUrl + imagePath : imagePath;
    
    // When fill is true, we want the image to completely cover its container.
    const defaultPdfStyle: React.CSSProperties = fill
      ? { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
      : {}; // otherwise, let the width/height attributes determine size

    // Merge any passed style
    const combinedStyle = style ? { ...defaultPdfStyle, ...style } : defaultPdfStyle;

    return (
      <img
        src={absoluteSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={combinedStyle}
        {...rest}
      />
    );
  } else {
    // In web mode, dynamically require next/image
    const NextImage = require('next/image').default;
    return (
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        {...rest}
      />
    );
  }
};

export default ImageWrapper;
