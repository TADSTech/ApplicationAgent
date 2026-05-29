// frontend/src/pages/SwipeMode.tsx
import React from 'react';

export const SwipeMode: React.FC = () => {
  return (
    <div style={{ padding: '24px', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>JOB JOCKEY // SWIPE MODE</h1>
      <p>Quick curation interface. Swipe right to approve autonomous application matching.</p>
      
      <div style={{ border: '1px solid #0f0', padding: '24px', maxWidth: '400px', margin: '32px auto', textAlign: 'center' }}>
        <h3>Senior Frontend Developer</h3>
        <p>GlobalTech (USA - EST Zone Overlap)</p>
        <p>Compensation: $110,000 (~₦170,500,000 NGN)</p>
        <button style={{ background: '#f00', color: '#fff', padding: '8px 16px', marginRight: '16px' }}>Swipe Left (Skip)</button>
        <button style={{ background: '#0f0', color: '#000', padding: '8px 16px' }}>Swipe Right (Apply)</button>
      </div>
    </div>
  );
};
export default SwipeMode;
