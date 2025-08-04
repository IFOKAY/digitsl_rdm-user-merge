import React, { useEffect, useState } from 'react';
import { Button } from '@carbon/react';
import axios from 'axios';
import { fetchIBMUserProfile } from '../services/api';
import '../styles/components/PersonalInfo.scss';

export default function ManagerDashboard({ onLogout }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    slackId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const userRes = await axios.get('/api/user', { withCredentials: true });
        const email = userRes.data?.email;
        if (!email) throw new Error('No email in authenticated user');
        const ibmProfile = await fetchIBMUserProfile(email);
        const content = ibmProfile.content || {};
        setUserData({
          name: content.nameFull || content.nameDisplay || '',
          email: content.preferredIdentity || email,
          slackId: content.preferredSlackUsername || '',
        });
      } catch (err) {
        setError('Failed to load manager info');
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, []);

  if (loading) return <div className="p-4">Loading manager info...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="header-left" />
        <h2 className="profile-title">Manager Dashboard</h2>
        <div className="header-right">
          <Button kind="tertiary" onClick={onLogout}>Logout</Button>
        </div>
      </header>
      <main className="profile-main">
        <div className="user-info-card">
          <h5>Manager Information</h5>
          <div className="info-field">
            <label>Email:</label>
            <span>{userData.email || 'Not set'}</span>
          </div>
          <div className="info-field">
            <label>Name:</label>
            <span>{userData.name || 'Not set'}</span>
          </div>
          <div className="info-field">
            <label>Slack ID:</label>
            <span>{userData.slackId || 'Not set'}</span>
          </div>
        </div>
      </main>
      <footer className="profile-footer">
        © IBM Corporation 2025. All rights reserved.
      </footer>
    </div>
  );
} 