// frontend/src/pages/Settings.tsx
import React, { useState } from 'react';

export const Settings: React.FC = () => {
  const [targetSalary, setTargetSalary] = useState<number>(80000);

  return (
    <div style={{ padding: '24px', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>JOB JOCKEY // CONFIGURATION SETTINGS</h1>
      <p>Configure matching preferences, target compensation, and timezone allowances.</p>

      <div style={{ marginTop: '24px' }}>
        <label>Target Minimum Salary (USD): </label>
        <input 
          type="number" 
          value={targetSalary} 
          onChange={(e) => setTargetSalary(Number(e.target.value))}
          style={{ background: '#333', color: '#0f0', border: '1px solid #0f0', padding: '4px' }}
        />
        <p>Current Target NGN equivalent: ₦{(targetSalary * 1550).toLocaleString()} NGN</p>
      </div>
    </div>
  );
};
export default Settings;
