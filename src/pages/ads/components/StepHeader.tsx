import React, { ReactNode } from "react";

interface StepHeaderProps {
  icon?: ReactNode;        // any React element (e.g., <Icon />)
  title?: string;          // step title text
  description?: string;    // step description text
}

const StepHeader: React.FC<StepHeaderProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {icon && (
        <div className="relative mb-3">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur opacity-75"></div>
          <div className="relative bg-white p-4 rounded-full shadow-sm border">
            {icon}
          </div>
        </div>
      )}
      {title && (
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h2>
      )}
      {description && (
        <p className="text-gray-500 text-sm">{description}</p>
      )}
    </div>
  );
};

export default StepHeader;
