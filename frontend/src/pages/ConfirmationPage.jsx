import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@carbon/react';
import { ArrowLeft } from 'lucide-react';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="skills-container">
      <div className="skills-header">
        <div className="flex items-center">
          <Button 
            kind="ghost" 
            hasIconOnly 
            renderIcon={ArrowLeft} 
            iconDescription="Back" 
            onClick={() => navigate('/skills')} 
            style={{ marginRight: '1rem' }}
          />
          <h1>Submission Confirmation</h1>
        </div>
      </div>

      <div 
        style={{ 
          margin: '100px auto', 
          textAlign: 'center', 
          padding: '2rem', 
          maxWidth: '500px',
          backgroundColor: '#f4f4f4',
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{ marginBottom: '1.5rem' }}>Your information has been successfully submitted.</h2>
        
        <Button 
          kind="primary" 
          onClick={() => navigate('/profile')}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationPage;