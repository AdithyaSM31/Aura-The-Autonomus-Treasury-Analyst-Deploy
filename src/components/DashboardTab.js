import React from 'react';
import IntelligentDashboard from './IntelligentDashboard';

const DashboardTab = ({ data, fileInfo }) => {
  return (
    <div className="p-6">
      <IntelligentDashboard data={data} fileInfo={fileInfo} />
    </div>
  );
};

export default DashboardTab;