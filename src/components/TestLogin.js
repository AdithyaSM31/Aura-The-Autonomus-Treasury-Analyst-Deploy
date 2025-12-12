import React from 'react';

const TestLogin = ({ onLoginSuccess }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Aura Treasury Analyst</h1>
        <button 
          onClick={onLoginSuccess}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Click to Login
        </button>
      </div>
    </div>
  );
};

export default TestLogin;
