// components/ui/my_components/marketing/ReportLayout.tsx
import React from 'react';

interface ReportLayoutProps {
  children: React.ReactNode;
}

const ReportLayout = ({ children }: ReportLayoutProps) => {
  return (
    <div className="max-w-5xl mx-auto bg-background shadow-xl rounded-lg p-12">
      {children}
    </div>
  );
};

export default ReportLayout;
