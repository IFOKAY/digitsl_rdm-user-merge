// simple redirect login component (optional)
import React, { useEffect } from 'react';

const LoginPage = () => {
  useEffect(() => {
    window.location.href = "http://localhost:8082/oauth2/authorization/appid";
  }, []);

  return <div>Redirecting to IBM W3ID login...</div>;
};

export default LoginPage;
