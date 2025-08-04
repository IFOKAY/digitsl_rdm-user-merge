import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Content,
  Header,
  HeaderName,
  SkipToContent
} from '@carbon/react';

import ProfilePage from './pages/ProfilePage';
import SkillsPage from './pages/SkillsPage';
import SkillsFormPage from './pages/SkillsFormPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProtectedRoute from './components/ProtectedRoute';
import PersonalInfo from './pages/PersonalInfo';
import AncillaryFormPage from './pages/AcillaryFormPage';
import IBMLogo from './components/IBMLogo';
import TestRedirect from './pages/TestRedirect';
import './App.css';
import ProfessionalCertificationForm from './pages/ProfessionalCertificationForm';
import HighImpactAssetForm from './pages/HighImpactAssetForm';

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = unauthenticated
  const [isManagerLoaded, setIsManagerLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      // Check for manager redirect first
      const managerRedirect = sessionStorage.getItem('managerRedirect');
      const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
      
      console.log('App.jsx - fetchUser - Manager redirect check:', {
        managerRedirect,
        seamlessRedirect,
        currentUrl: window.location.href,
        currentPath: window.location.pathname
      });
      
      if (managerRedirect === 'true' || seamlessRedirect === 'true') {
        console.log('Manager redirect detected, skipping user fetch and setting isManagerLoaded to true');
        
        // Clear old session storage data that might cause redirect loops
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('isManager');
        sessionStorage.removeItem('functionalManagerEmail');
        
        // For manager redirects, create a mock user object to prevent authentication issues
        const mockUser = {
          email: sessionStorage.getItem('managerEmail'),
          name: sessionStorage.getItem('managerName'),
          isManagerRedirect: true
        };
        setUser(mockUser);
        setIsManagerLoaded(true);
        return;
      }
      
      try {
        const res = await fetch('http://localhost:8082/api/user', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Redirect if unauthenticated (but allow manager redirects)
  useEffect(() => {
    console.log('App.jsx - Authentication check - user:', user);
    
    if (user === null) {
      // Check if this is a manager redirect
      const managerRedirect = sessionStorage.getItem('managerRedirect');
      const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
      
      console.log('App.jsx - Authentication check - Manager redirect flags:', {
        managerRedirect,
        seamlessRedirect
      });
      
      if (managerRedirect === 'true' || seamlessRedirect === 'true') {
        // This is a manager redirect, don't force login
        // The manager data is already in session storage
        console.log('Manager redirect detected, skipping authentication check');
        return;
      }
      // Normal user flow - redirect to login
      console.log('Normal user flow - redirecting to OAuth2 login');
      window.location.href = 'http://localhost:8082/oauth2/authorization/appid';
    }
  }, [user]);

  // Fetch isManager and set in sessionStorage, then set isManagerLoaded
  useEffect(() => {
    // Check if this is a manager redirect (skip profile fetch)
    const managerRedirect = sessionStorage.getItem('managerRedirect');
    const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
    
    if (managerRedirect === 'true' || seamlessRedirect === 'true') {
      console.log('Manager redirect detected, skipping profile fetch');
      setIsManagerLoaded(true);
      return;
    }
    
    if (user && user.email) {
      sessionStorage.setItem('userEmail', user.email);
      // Always use email for /profiles/{email}/profile
      const email = user.email;
      fetch(`http://localhost:8082/api/profiles/${email}/profile`, { credentials: 'include' })
        .then(res => res.json())
        .then(profile => {
          const isManager = profile?.employeeType?.isManager === true;
          sessionStorage.setItem('isManager', isManager ? 'true' : 'false');
          
          // Store functionalManager.preferredIdentity in session storage
          if (profile?.functionalManager?.preferredIdentity) {
            sessionStorage.setItem('functionalManagerEmail', profile.functionalManager.preferredIdentity);
            console.log('Stored functionalManagerEmail in session storage:', profile.functionalManager.preferredIdentity);
            console.log('Full functionalManager data:', profile.functionalManager);
          } else {
            console.warn('No functionalManager data found in profile:', profile);
          }
          
          setIsManagerLoaded(true);
        })
        .catch((err) => {
          console.log('[DEBUG] Profile fetch failed, setting isManager to false:', err);
          sessionStorage.setItem('isManager', 'false');
          setIsManagerLoaded(true);
        });
    }
  }, [user]);

  // Redirect to personal-info or manager-ui after successful login, only after isManagerLoaded
  useEffect(() => {
    if (!isManagerLoaded) {
      console.log('App.jsx - Redirect useEffect: isManagerLoaded is false, skipping');
      return;
    }
    
    // Check if this is a manager redirect (don't redirect back to manager_ui)
    const managerRedirect = sessionStorage.getItem('managerRedirect');
    const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
    const userInitiatedNavigation = sessionStorage.getItem('userInitiatedNavigation');
    
    console.log('App.jsx - Redirect useEffect triggered:', {
      isManagerLoaded,
      managerRedirect,
      seamlessRedirect,
      userInitiatedNavigation,
      currentPath: location.pathname,
      currentUrl: window.location.href,
      storedEmail: sessionStorage.getItem('userEmail'),
      isManager: sessionStorage.getItem('isManager'),
      userEmail: user?.email,
      userIsManagerRedirect: user?.isManagerRedirect
    });
    
    if (managerRedirect === 'true' || seamlessRedirect === 'true' || user?.isManagerRedirect || userInitiatedNavigation === 'true') {
      console.log('App.jsx - Manager redirect or user navigation detected, skipping automatic redirect to manager_ui');
      console.log('App.jsx - Redirect flags:', {
        managerRedirect,
        seamlessRedirect,
        userIsManagerRedirect: user?.isManagerRedirect,
        userInitiatedNavigation
      });
      return;
    }
    
    const storedEmail = sessionStorage.getItem('userEmail');
    const isManager = sessionStorage.getItem('isManager');
    console.log('[DEBUG] Redirect check:', { storedEmail, isManager });
    
    // Only redirect managers to manager_ui if they're not already coming from there
    // Also check if we're on the personal-info, profile, or skills-related pages (which means they're already where they should be)
    console.log('App.jsx - Redirect check details:', {
      storedEmail,
      isManager,
      managerRedirect,
      seamlessRedirect,
      userIsManagerRedirect: user?.isManagerRedirect,
      userInitiatedNavigation,
      currentPath: location.pathname,
      isSkillsPage: location.pathname.startsWith('/skills'),
      shouldRedirect: storedEmail && isManager === 'true' && !managerRedirect && !seamlessRedirect && !user?.isManagerRedirect && userInitiatedNavigation !== 'true' && location.pathname !== '/personal-info' && location.pathname !== '/profile' && !location.pathname.startsWith('/skills')
    });
    
    if (storedEmail && isManager === 'true' && !managerRedirect && !seamlessRedirect && !user?.isManagerRedirect && userInitiatedNavigation !== 'true' && location.pathname !== '/personal-info' && location.pathname !== '/profile' && !location.pathname.startsWith('/skills')) {
        // Redirect to manager_ui (frontend 5174, backend 8083)
        console.log('App.jsx - Redirecting manager to manager_ui');
        console.log('App.jsx - Redirect conditions:', {
          storedEmail,
          isManager,
          managerRedirect,
          seamlessRedirect,
          userIsManagerRedirect: user?.isManagerRedirect,
          userInitiatedNavigation,
          currentPath: location.pathname
        });
        window.location.replace(`http://localhost:5174/?email=${encodeURIComponent(storedEmail)}`);
    } else if (storedEmail && isManager === 'false') {
      // Only redirect if on root or login
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate('/personal-info', { replace: true });
      }
    }
  }, [isManagerLoaded, navigate, location.pathname]);

  if (user === undefined) {
    return <div style={{ textAlign: 'center' }}>Checking authentication...</div>;
  }

  // Check if this is a manager redirect
  const managerRedirect = sessionStorage.getItem('managerRedirect');
  const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
  const isManagerRedirect = managerRedirect === 'true' || seamlessRedirect === 'true';
  
  const isAuthenticated = !!user?.email || isManagerRedirect || user?.isManagerRedirect;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {isAuthenticated && (
        <Header aria-label="IBM SkillsPro">
          <SkipToContent />
          <HeaderName prefix="IBM">SkillsPro</HeaderName>
          <div style={{ marginLeft: 'auto', paddingRight: '1rem' }}>
            <IBMLogo />
          </div>
        </Header>
      )}

      <Content style={{ flex: 1, overflow: isAuthenticated ? 'auto' : 'hidden', position: 'relative', height: 'calc(100vh - 48px)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/personal-info" replace />} />
          <Route path="/personal-info" element={<PersonalInfo onLogout={() => setUser(null)} />} />
          <Route path="/profile" element={
            <ProfilePage 
              userEmail={user?.email} 
              onLogout={() => setUser(null)} 
            />
          } />
          <Route path="/test-redirect" element={<TestRedirect />} />
          <Route
            path="/skills"
            element={
              (isAuthenticated || sessionStorage.getItem('managerRedirect') === 'true' || sessionStorage.getItem('seamlessManagerRedirect') === 'true')
                ? <SkillsPage />
                : <Navigate to="/personal-info" replace />
            }
          />
          <Route
            path="/skills/form"
            element={
              (isAuthenticated || sessionStorage.getItem('managerRedirect') === 'true' || sessionStorage.getItem('seamlessManagerRedirect') === 'true')
                ? <SkillsFormPage />
                : <Navigate to="/personal-info" replace />
            }
          />
          <Route
            path="/skills/ancillary-form"
            element={
              (isAuthenticated || sessionStorage.getItem('managerRedirect') === 'true' || sessionStorage.getItem('seamlessManagerRedirect') === 'true')
                ? <AncillaryFormPage />
                : <Navigate to="/personal-info" replace />
            }
          />
          <Route
            path="/skills/professional-form"
            element={
              (isAuthenticated || sessionStorage.getItem('managerRedirect') === 'true' || sessionStorage.getItem('seamlessManagerRedirect') === 'true')
                ? <ProfessionalCertificationForm />
                : <Navigate to="/personal-info" replace />
            }
          />
          <Route
            path="/skills/high-impact-asset-form"
            element={
              (isAuthenticated || sessionStorage.getItem('managerRedirect') === 'true' || sessionStorage.getItem('seamlessManagerRedirect') === 'true')
                ? <HighImpactAssetForm />
                : <Navigate to="/personal-info" replace />
            }
          />
          <Route
            path="/confirmation"
            element={
              (isAuthenticated || sessionStorage.getItem('managerRedirect') === 'true' || sessionStorage.getItem('seamlessManagerRedirect') === 'true')
                ? <ConfirmationPage />
                : <Navigate to="/personal-info" replace />
            }
          />
        </Routes>
      </Content>
    </div>
  );
}

export default App;
