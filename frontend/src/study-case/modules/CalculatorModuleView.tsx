import React from 'react';
import CalculatorApp from '../calculator/App';

export const CalculatorModuleView: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8DCCA] shadow-xs bg-[#FAF7F2]">
      <CalculatorApp />
    </div>
  );
};
