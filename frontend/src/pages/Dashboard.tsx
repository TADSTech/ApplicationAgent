// frontend/src/pages/Dashboard.tsx
import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '24px', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>JOB JOCKEY // DASHBOARD</h1>
      <p>Secure global remote & relocation roles. WAT timezone configured.</p>
      
      <div style={{ border: '1px solid #0f0', padding: '16px', marginTop: '16px' }}>
        <h2>System Status: ONLINE</h2>
        <ul>
          <li>Active Applications: 0</li>
          <li>Scraped Listings: 1</li>
          <li>Adapted CVs: 0</li>
        </ul>
      </div>
    </div>
  );
};
export default Dashboard;
