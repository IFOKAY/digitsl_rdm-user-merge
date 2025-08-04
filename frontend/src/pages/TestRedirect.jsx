import React, { useState, useEffect } from 'react';

export default function TestRedirect() {
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    // Check session storage every second
    const interval = setInterval(() => {
      const data = {
        managerRedirect: sessionStorage.getItem('managerRedirect'),
        managerEmail: sessionStorage.getItem('managerEmail'),
        managerName: sessionStorage.getItem('managerName'),
        managerSlackId: sessionStorage.getItem('managerSlackId'),
        seamlessManagerRedirect: sessionStorage.getItem('seamlessManagerRedirect'),
        returningToManager: sessionStorage.getItem('returningToManager'),
        userEmail: sessionStorage.getItem('userEmail'),
        isManager: sessionStorage.getItem('isManager'),
        currentUrl: window.location.href,
        currentPath: window.location.pathname
      };
      setSessionData(data);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearSessionStorage = () => {
    sessionStorage.clear();
    console.log('Session storage cleared');
  };

  const simulateManagerRedirect = () => {
    sessionStorage.setItem('managerRedirect', 'true');
    sessionStorage.setItem('managerEmail', 'test@ibm.com');
    sessionStorage.setItem('managerName', 'Test Manager');
    sessionStorage.setItem('managerSlackId', 'test-slack');
    sessionStorage.setItem('seamlessManagerRedirect', 'true');
    console.log('Simulated manager redirect data set');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Redirection Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={clearSessionStorage} style={{ marginRight: '10px' }}>
          Clear Session Storage
        </button>
        <button onClick={simulateManagerRedirect}>
          Simulate Manager Redirect
        </button>
      </div>

      <h2>Session Storage Data:</h2>
      <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(sessionData, null, 2)}
      </pre>

      <h2>Current Page Info:</h2>
      <p><strong>URL:</strong> {window.location.href}</p>
      <p><strong>Path:</strong> {window.location.pathname}</p>
      <p><strong>Port:</strong> {window.location.port}</p>
    </div>
  );
} 