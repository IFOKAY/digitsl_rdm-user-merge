import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TextInput, TextArea, Select, SelectItem, Tooltip, Modal, Tag } from '@carbon/react';
import { ArrowLeft, Mail } from 'lucide-react';
import { userService, fetchIBMUserProfile } from '../services/api';
import './ProfilePage.scss';

const ProfilePage = ({ userEmail, onLogout }) => {
  console.log('ProfilePage - Component rendered with props:', { userEmail, onLogout });
  console.log('ProfilePage - Current URL:', window.location.href);
  console.log('ProfilePage - Current pathname:', window.location.pathname);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    slackId: '',
    practice: '',
    specialtyArea: '',
    practiceProductTechnology: '',
    numberOfCustomerProjects: '',
    selfAssessLevelForSpeciality: '',
    professionalLevel: '',
    projectExperiences: [],
    secondarySkills: [],
    ancillarySkills: [],
  });

  const [practices, setPractices] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [allPracticeAreas, setAllPracticeAreas] = useState([]);
  const [practiceProducts, setPracticeProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newProject, setNewProject] = useState(null);

  const [ibmProfile, setIbmProfile] = useState(null);
  const [ibmProfileError, setIbmProfileError] = useState(null);

  const [isNewUser, setIsNewUser] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [inboxModalOpen, setInboxModalOpen] = useState(false);

  const [professionalCertifications, setProfessionalCertifications] = useState([]);
  const [highImpactAssets, setHighImpactAssets] = useState([]);

  // Add client tier options
  const clientTierOptions = [
    'internal',
    'midsized',
    'strategic',
    'fortune 500/100',
    'Global/Federal/Regulated'
  ];

  // Add project complexity options
  const projectComplexityOptions = [
    'simple',
    'moderate',
    'advanced',
    'complex',
    'highly complex'
  ];

  // Add responsibilities options
  const responsibilitiesOptions = [
    'Shadow – no client interaction/no deliverables',
    'Delivery Team member, limited Client Facing',
    'Active contributor to client deliverables, supports meetings',
    'Drives delivery, owns client discussions'
  ];

  // Add duration options
  const durationOptions = [
    '< 3 months',
    '<6 months',
    '1 year',
    '1.5 – 2 years',
    '2-3 years'
  ];

  // Add state for rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  // Add state for deleting project
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [removedProjectExperiences, setRemovedProjectExperiences] = useState([]);

  // Fetch unread messages for the user
  const fetchUnreadMessages = async () => {
    try {
      const email = profileData.email ? profileData.email.toLowerCase() : '';
      console.log('[DEBUG] Fetching unread messages for email:', email);
      const url = `http://localhost:8082/api/user-messages/${email}/unread`;
      console.log('[DEBUG] Unread messages URL:', url);
      const response = await axios.get(url, { withCredentials: true });
      // Ensure read is always boolean
      const messages = (response.data || []).map(msg => ({ ...msg, read: !!msg.read }));
      console.log('[DEBUG] Fetched unread messages:', messages);
      setUnreadMessages(messages);
    } catch (error) {
      console.error('[DEBUG] Failed to fetch messages:', error);
    }
  };

  const handleInboxClick = async () => {
    setInboxModalOpen(true);
    // Fetch all messages when inbox is opened
    try {
      const email = profileData.email ? profileData.email.toLowerCase() : '';
      const url = `http://localhost:8082/api/user-messages/${email}`;
      const response = await axios.get(url, { withCredentials: true });
      const messages = (response.data || []).map(msg => ({ ...msg, read: !!msg.read }));
      setAllMessages(messages);
    } catch (error) {
      console.error('[DEBUG] Failed to fetch all messages:', error);
    }
    // Mark unread messages as read when inbox is opened
    if (unreadMessages.length > 0) {
      await Promise.all(unreadMessages.map(async (msg) => {
        try {
          await axios.put(`http://localhost:8082/api/user-messages/${msg.id}/read`, {}, { withCredentials: true });
        } catch (error) {
          console.error('[DEBUG] Failed to mark message as read:', error);
        }
      }));
      setUnreadMessages([]);
      // Re-fetch unread messages to ensure state is up to date
      await fetchUnreadMessages();
    }
  };

  // When the inbox modal is closed, re-fetch unread messages to update badge
  useEffect(() => {
    if (!inboxModalOpen && profileData.email && profileData.email.includes('@')) {
      fetchUnreadMessages();
    }
  }, [inboxModalOpen, profileData.email]);

  useEffect(() => {
    axios.get('http://localhost:8082/api/practices')
      .then((res) => {
        if (Array.isArray(res.data)) {
          const practicesData = res.data;
          setPractices(practicesData);

          const allPracticeAreas = practicesData.flatMap(practice => {
            return (practice.practiceAreas || []).map(area => ({
              ...area,
              practice_id: practice.id,
              practice_name: practice.name
            }));
          });
          setAllPracticeAreas(allPracticeAreas);
          setPracticeAreas(allPracticeAreas);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch practices:', err);
      });
  }, []);

  // Fetch authenticated user and set profileData.email before any message fetches
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        // Check for manager redirect first
        const managerRedirect = sessionStorage.getItem('managerRedirect');
        const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
        
        console.log('ProfilePage - Manager redirect check:', {
          managerRedirect,
          seamlessRedirect,
          currentUrl: window.location.href
        });
        
        let email;
        let managerName;
        let managerSlackId;
        
        if (managerRedirect === 'true' || seamlessRedirect === 'true') {
          // This is a manager redirect, use manager data from session storage
          console.log('ProfilePage - Manager redirect detected, using session storage data');
          email = sessionStorage.getItem('managerEmail');
          managerName = sessionStorage.getItem('managerName');
          managerSlackId = sessionStorage.getItem('managerSlackId');
          
          console.log('ProfilePage - Manager data from session storage:', {
            email,
            name: managerName,
            slackId: managerSlackId
          });
          
          // Set basic profile data for manager
          setProfileData(prev => ({
            ...prev,
            email: email || '',
            name: managerName || '',
            slackId: managerSlackId || '',
          }));
          
          setLoading(false);
          return;
        }
        
        // Normal user flow - fetch from API
        const response = await axios.get('http://localhost:8082/api/user', { withCredentials: true });
        email = response.data?.email;
        if (email) {
          setProfileData(prev => ({ ...prev, email }));
          // Now fetch the full profile
          const profileResponse = await axios.get(`http://localhost:8082/api/profile/${email}`, { withCredentials: true });
          if (profileResponse.data) {
            const data = profileResponse.data;
            setIsNewUser(!!data.isNewUser);
            setProfileData(prev => ({
              ...prev,
              slackId: data.slackId || prev.slackId || '',
              practice: data.practiceId ? String(data.practiceId) : '',
              specialtyArea: data.practiceAreaId ? String(data.practiceAreaId) : '',
              practiceProductTechnology: data.practiceProductTechnologyId ? String(data.practiceProductTechnologyId) : '',
              numberOfCustomerProjects: data.projectsDone || '',
              selfAssessLevelForSpeciality: data.selfAssessmentLevel || '',
              professionalLevel: data.professionalLevel || '',
              projectExperiences: data.projectExperiences || [],
              secondarySkills: data.secondarySkills || [],
              ancillarySkills: data.ancillarySkills || [],
              email // ensure email is set
            }));
            const selectedPracticeArea = allPracticeAreas.find(pa => String(pa.id) === String(data.practiceAreaId));
            if (selectedPracticeArea && selectedPracticeArea.products) {
              setPracticeProducts(selectedPracticeArea.products);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    // Check for manager redirect first
    const managerRedirect = sessionStorage.getItem('managerRedirect');
    const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
    
    if (managerRedirect === 'true' || seamlessRedirect === 'true') {
      // For manager redirects, fetch user data immediately without waiting for practices
      console.log('ProfilePage - Manager redirect detected, fetching user data immediately');
      fetchUserAndProfile();
    } else if (practices.length > 0 && allPracticeAreas.length > 0) {
      // Normal user flow - wait for practices data
      fetchUserAndProfile();
    }
  }, [practices, allPracticeAreas]);

  // Only fetch messages when profileData.email is set and valid
  useEffect(() => {
    // Check for manager redirect first
    const managerRedirect = sessionStorage.getItem('managerRedirect');
    const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
    
    if (managerRedirect === 'true' || seamlessRedirect === 'true') {
      // For manager redirects, skip fetching messages for now
      console.log('ProfilePage - Manager redirect detected, skipping messages fetch');
      return;
    }
    
    if (profileData.email && profileData.email.includes('@')) {
      fetchUnreadMessages();
    }
  }, [profileData.email]);

  useEffect(() => {
    const fetchAndSetIBMProfile = async () => {
      try {
        // Check for manager redirect first
        const managerRedirect = sessionStorage.getItem('managerRedirect');
        const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
        
        if (managerRedirect === 'true' || seamlessRedirect === 'true') {
          // For manager redirects, use session storage data
          const email = sessionStorage.getItem('managerEmail');
          const managerName = sessionStorage.getItem('managerName');
          
          if (email) {
            setProfileData(prev => ({
              ...prev,
              name: managerName || '',
              email: email,
            }));
          }
          return;
        }
        
        // Normal user flow - get the authenticated user's email from backend
        const response = await axios.get('/api/user', { withCredentials: true });
        const email = response.data?.email;
        if (email) {
          const data = await fetchIBMUserProfile(email);
          const content = data.content || {};
          setProfileData(prev => ({
            ...prev,
            name: content.nameDisplay || '',
            email: content.preferredIdentity || '',
          }));
        }
      } catch (err) {
        setIbmProfileError(err);
      }
    };
    fetchAndSetIBMProfile();
  }, []);

  // Fetch professional certifications and high impact assets
  const fetchExtraSkillsData = async (userId) => {
    try {
      // Professional Certifications
      const profCertRes = await axios.get(`http://localhost:8082/api/professional-certifications/user/${userId}`);
      setProfessionalCertifications(profCertRes.data || []);
      // High Impact Assets
      const highImpactRes = await axios.get(`http://localhost:8082/api/high-impact-assets/user/${userId}`);
      setHighImpactAssets(highImpactRes.data || []);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    // Check for manager redirect first
    const managerRedirect = sessionStorage.getItem('managerRedirect');
    const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
    
    if (managerRedirect === 'true' || seamlessRedirect === 'true') {
      // For manager redirects, skip fetching extra skills data for now
      console.log('ProfilePage - Manager redirect detected, skipping extra skills data fetch');
      return;
    }
    
    // Normal user flow
    axios.get('/api/user', { withCredentials: true })
      .then(async (response) => {
        const userId = response.data.id;
        if (userId) {
          await fetchExtraSkillsData(userId);
        }
      });
  }, []);

  // Composite score calculations for each section
  const compositeProjectExperience = profileData.projectExperiences && profileData.projectExperiences.length > 0
    ? profileData.projectExperiences
        .map((p) => (typeof p.projectScore === 'number' ? p.projectScore : 0))
        .reduce((a, b) => a + b, 0) / profileData.projectExperiences.length
    : 0;

  const compositeProductCertification = profileData.secondarySkills && profileData.secondarySkills.length > 0
    ? profileData.secondarySkills
        .map((s) => (typeof s.certificationScore === 'number' ? s.certificationScore : 0))
        .reduce((a, b) => a + b, 0) / profileData.secondarySkills.length
    : 0;

  const compositeThirdPartyCertification = profileData.ancillarySkills && profileData.ancillarySkills.length > 0
    ? profileData.ancillarySkills
        .map((c) => (typeof c.certificationScore === 'number' ? c.certificationScore : 0))
        .reduce((a, b) => a + b, 0) / profileData.ancillarySkills.length
    : 0;

  const compositeProfessionalCertification = professionalCertifications && professionalCertifications.length > 0
    ? professionalCertifications
        .map((c) => (typeof c.certificationScore === 'number' ? c.certificationScore : 0))
        .reduce((a, b) => a + b, 0) / professionalCertifications.length
    : 0;

  const compositeHighImpactAssets = highImpactAssets && highImpactAssets.length > 0
    ? highImpactAssets
        .map((a) => (typeof a.impactScore === 'number' ? a.impactScore : 0))
        .reduce((a, b) => a + b, 0) / highImpactAssets.length
    : 0;

  // Overall composite score index (weighted sum divided by 5)
  const overallCompositeScore =
    (
      0.25 * compositeProjectExperience +
      0.15 * compositeProductCertification +
      0.15 * compositeThirdPartyCertification +
      0.25 * compositeHighImpactAssets +
      0.20 * compositeProfessionalCertification
    ) / 5;

  const handleProfileChange = (key, value) => {
    setProfileData(prev => {
      const newData = { ...prev, [key]: value };
      // Reset dependent fields when parent field changes
      if (key === 'practice') {
        newData.specialtyArea = '';
        newData.practiceProductTechnology = '';
      } else if (key === 'specialtyArea') {
        newData.practiceProductTechnology = '';
      }
      return newData;
    });
  };

  const handleProjectChange = (id, key, value) => {
    setProfileData(prev => ({
      ...prev,
      projectExperiences: prev.projectExperiences.map(project =>
        project.id === id ? { ...project, [key]: value } : project
      )
    }));
  };

  const handleNewProjectChange = (key, value) => {
    setNewProject({ ...newProject, [key]: value });
  };

  const handleInitiateAddProject = () => {
    // Only set newProject to make the form visible with a unique key
    setNewProject({
      id: `temp-new-${Date.now()}`, // Unique ID for the new project form
      projectTitle: '',
      technologiesUsed: '',
      duration: '',
      responsibilities: '',
      clientTierV2: '',
      projectComplexity: ''
    });
  };

  const handleSaveNewProject = () => {
    if (!newProject.projectTitle.trim() || !newProject.technologiesUsed.trim() || !newProject.duration.trim() || !newProject.responsibilities.trim() || !newProject.clientTierV2 || !newProject.projectComplexity) {
      alert('Please fill all project fields before adding.');
      return;
    }

    // Generate a unique temporary ID for the new project being added to the list
    const tempIds = profileData.projectExperiences
      .filter(p => typeof p.id === 'string' && p.id.startsWith('temp-'))
      .map(p => parseInt(p.id.substring(5)))
      .filter(id => !isNaN(id));

    const newProjectListItemId = tempIds.length > 0 ? Math.min(...tempIds) - 1 : -1;
    const newId = `temp-${newProjectListItemId}`;

    setProfileData(prev => ({
      ...prev,
      projectExperiences: [...prev.projectExperiences, { ...newProject, id: newId }]
    }));
    setNewProject(null); // Clear the new project form
  };

  const handleCancelNewProject = () => {
    setNewProject(null);
  };

  // Update handleDeleteProject to support red highlight
  const handleDeleteProject = async (projectId) => {
    setDeletingProjectId(projectId);
    const confirmDelete = window.confirm('Are you sure you want to delete this project experience?');
    if (!confirmDelete) {
      setDeletingProjectId(null);
      return;
    }
    setProfileData(prev => ({
      ...prev,
      projectExperiences: prev.projectExperiences.filter((project) => project.id !== projectId)
    }));
    setDeletingProjectId(null);
  };

  const handleSave = async () => {
    // Validation: check if all required fields are filled
    if (!profileData.practice ||
        !profileData.specialtyArea ||
        !profileData.practiceProductTechnology ||
        !profileData.numberOfCustomerProjects ||
        !profileData.selfAssessLevelForSpeciality ||
        !profileData.professionalLevel) {
      alert('Please fill all required fields in the Professional Information section before saving.');
      return;
    }
    try {
      // const email = localStorage.getItem('userEmail');
      // if (!email) {
      //   navigate('/login');
      //   return;
      // }

      // Get the practice area name from the ID
      const practiceAreaName = practiceAreas.find(pa => String(pa.id) === profileData.specialtyArea)?.name || '';

      // Get the product name from the ID
      const productName = practiceProducts.find(pp => String(pp.id) === profileData.practiceProductTechnology)?.product_name || '';
      console.log("Check ", profileData)
      // Prepare data for API
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        slackId: profileData.slackId,
        practiceId: profileData.practice ? parseInt(profileData.practice) : null,
        practiceAreaId: profileData.specialtyArea ? parseInt(profileData.specialtyArea) : null,
        practiceProductTechnologyId: profileData.practiceProductTechnology ? parseInt(profileData.practiceProductTechnology) : null,
        projectsDone: profileData.numberOfCustomerProjects,
        selfAssessmentLevel: profileData.selfAssessLevelForSpeciality,
        professionalLevel: profileData.professionalLevel,
        projectExperiences: profileData.projectExperiences.map(proj => ({
          id: proj.id,
          projectTitle: proj.projectTitle,
          technologiesUsed: proj.technologiesUsed,
          duration: proj.duration,
          responsibilities: proj.responsibilities,
          clientTierV2: proj.clientTierV2 || '',
          projectComplexity: proj.projectComplexity || '',
          projectScore: proj.projectScore || null, // Include projectScore in update data
        })),
        secondarySkills: profileData.secondarySkills,
        ancillarySkills: profileData.ancillarySkills,
      };

      console.log('Saving profile data:', profileData.email);
      const email = profileData.email;
      await axios.put(`http://localhost:8082/api/profile/${email}`, updateData);
      setIsEditing(false);
      alert('Profile saved successfully!');
      // Re-fetch user profile after successful save to ensure UI is updated
      // await fetchUserProfile(); // This line was removed as per the new_code, as the user profile is now fetched in the useEffect
      setIsNewUser(false); // Assume user is no longer new after saving
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile changes');
      alert('Failed to save profile changes. Please try again.');
    }
  };

  // Helper to fetch pending approval for current user
  const fetchPendingApproval = async (email) => {
    try {
      const approvalsRes = await axios.get('http://localhost:8082/api/pending-approvals');
      const approvals = approvalsRes.data;
      console.log('[DEBUG ProfilePage] All pending approvals:', approvals);
      const approval = approvals.find(a => a.email === email && a.status === 'Pending');
      console.log('[DEBUG ProfilePage] Found approval for email:', email, approval);
      if (approval) {
        const detailRes = await axios.get(`http://localhost:8082/api/pending-approvals/${approval.id}`);
        console.log('[DEBUG ProfilePage] Approval details:', detailRes.data);
        setRemovedProjectExperiences(detailRes.data.removedProjectExperiences || []);
        console.log('[DEBUG ProfilePage] Set removedProjectExperiences:', detailRes.data.removedProjectExperiences || []);
      } else {
        setRemovedProjectExperiences([]);
        console.log('[DEBUG ProfilePage] No pending approval found, cleared removedProjectExperiences');
      }
    } catch (err) {
      console.error('[DEBUG ProfilePage] Error fetching pending approval:', err);
      setRemovedProjectExperiences([]);
    }
  };

  useEffect(() => {
    if (profileData.email) {
      fetchPendingApproval(profileData.email);
    }
  }, [profileData.email]);

  // Helper to check if a row is in a removed list (by id or unique fields)
  const isRemoved = (row, removedList, idField = 'id') => {
    console.log('[DEBUG ProfilePage] isRemoved called with:', { row, removedList, idField });
    const result = removedList.some(removed => {
      if (row[idField] && removed[idField]) {
        const match = String(row[idField]) === String(removed[idField]);
        console.log('[DEBUG ProfilePage] Comparing IDs:', { rowId: row[idField], removedId: removed[idField], match });
        return match;
      }
      // fallback: compare all fields
      const jsonMatch = JSON.stringify(row) === JSON.stringify(removed);
      console.log('[DEBUG ProfilePage] JSON comparison:', { rowJson: JSON.stringify(row), removedJson: JSON.stringify(removed), match: jsonMatch });
      return jsonMatch;
    });
    console.log('[DEBUG ProfilePage] isRemoved result:', result);
    return result;
  };

  // Filtered practice areas for the selected practice
  const filteredPracticeAreas = allPracticeAreas.filter(pa => String(pa.practice_id) === String(profileData.practice));
  // Filtered products for the selected practice area
  const selectedPracticeAreaObj = allPracticeAreas.find(pa => String(pa.id) === String(profileData.specialtyArea));
  const filteredPracticeProducts = selectedPracticeAreaObj && selectedPracticeAreaObj.products ? selectedPracticeAreaObj.products : [];

  // Add a function to check if all required professional info fields are filled
  const isProfessionalInfoComplete = () => {
    return (
      profileData.practice &&
      profileData.specialtyArea &&
      profileData.practiceProductTechnology &&
      profileData.numberOfCustomerProjects &&
      profileData.selfAssessLevelForSpeciality &&
      profileData.professionalLevel
    );
  };

  // Helper to get display name by ID
  const getPracticeName = (id) => {
    if (!id) return '';
    const found = practices.find(p => String(p.id) === String(id));
    if (!found) { console.warn('Practice not found for id:', id, practices); }
    return found ? found.name : id;
  };
  const getPracticeAreaName = (id) => {
    if (!id) return '';
    const found = allPracticeAreas.find(pa => String(pa.id) === String(id));
    if (!found) { console.warn('PracticeArea not found for id:', id, allPracticeAreas); }
    return found ? found.name : id;
  };
  const getProductName = (id) => {
    if (!id) return '';
    let found = null;
    for (const area of allPracticeAreas) {
      if (area.products) {
        found = area.products.find(pp => String(pp.id) === String(id));
        if (found) break;
      }
    }
    if (!found) { console.warn('Product not found for id:', id, allPracticeAreas); }
    return found ? found.product_name : id;
  };

  console.log('ProfilePage - Render state:', { loading, error, profileData });
  
  if (loading) {
    console.log('ProfilePage - Showing loading state');
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    console.log('ProfilePage - Showing error state:', error);
    return <div className="p-4 text-red-500">{error}</div>;
  }
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            kind="ghost"
            hasIconOnly
            renderIcon={ArrowLeft}
            iconDescription="Back"
            onClick={() => navigate('/personal-info')}
            style={{ marginRight: '1rem' }}
          />
          <h1>SkillsPro Profile</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Inbox Icon with Notification */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleInboxClick}>
            <Mail size={20} style={{ color: '#0f62fe' }} />
            {(unreadMessages.length > 0) && (
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#da1e28',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {unreadMessages.length}
              </div>
            )}
          </div>
          
          {isEditing ? (
            <Button kind="primary" onClick={handleSave}>Save</Button>
          ) : (
            <Button kind="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
          )}
          <Button kind="tertiary" onClick={onLogout}>Logout</Button>
        </div>
      </div>

      <div className="profile-section">
        <h2>Professional Information</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Practice</TableHeader>
              <TableHeader>Practice Area</TableHeader>
              <TableHeader>Practice Product/Technology</TableHeader>
              <TableHeader># of Customer Projects</TableHeader>
              <TableHeader>Self Assessment Level</TableHeader>
              <TableHeader>Professional Level</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{profileData.name}</TableCell>
              <TableCell>{profileData.email}</TableCell>
              <TableCell>
                {isEditing ? (
                  <Select
                    id="profile-practice"
                    labelText="Practice"
                    value={profileData.practice || ''}
                    onChange={(e) => {
                      handleProfileChange('practice', e.target.value);
                    }}
                    hideLabel
                  >
                    <SelectItem value="" text="Select Practice" />
                    {practices.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)} text={p.name} />
                    ))}
                  </Select>
                ) : (
                  getPracticeName(profileData.practice) || 'Not set'
                )}
              </TableCell>

              <TableCell>
                {isEditing ? (
                  <Select
                    id="profile-practice-area"
                    labelText="Practice Area"
                    value={profileData.specialtyArea || ''}
                    onChange={(e) => {
                      handleProfileChange('specialtyArea', e.target.value);
                    }}
                    hideLabel
                    disabled={!profileData.practice}
                  >
                    <SelectItem value="" text="Select Practice Area" />
                    {filteredPracticeAreas.map((pa) => (
                      <SelectItem key={pa.id} value={String(pa.id)} text={pa.name} />
                    ))}
                  </Select>
                ) : (
                  getPracticeAreaName(profileData.specialtyArea) || 'Not set'
                )}
              </TableCell>

              <TableCell>
                {isEditing ? (
                  <Select
                    id="profile-practice-product"
                    labelText="Practice Product/Technology"
                    value={profileData.practiceProductTechnology || ''}
                    onChange={(e) => {
                      handleProfileChange('practiceProductTechnology', e.target.value);
                    }}
                    hideLabel
                    disabled={!profileData.specialtyArea}
                  >
                    <SelectItem value="" text="Select Product/Technology" />
                    {filteredPracticeProducts.length > 0 && profileData.specialtyArea && filteredPracticeProducts.map((pp) => (
                      <SelectItem
                        key={pp.id}
                        value={String(pp.id)}
                        text={pp.product_name}
                      />
                    ))}
                  </Select>
                ) : (
                  getProductName(profileData.practiceProductTechnology) || 'Not set'
                )}
              </TableCell>

              <TableCell>
                {isEditing ? (
                  <Select
                    id="profile-customer-projects"
                    labelText="# of Customer Projects"
                    value={profileData.numberOfCustomerProjects}
                    onChange={(e) => handleProfileChange('numberOfCustomerProjects', e.target.value)}
                    hideLabel
                  >
                    <SelectItem value="" text="Select # of Customer Projects" />
                    <SelectItem value="0" text="0" />
                    <SelectItem value="1-3" text="1-3" />
                    <SelectItem value="4-5" text="4-5" />
                    <SelectItem value="6+" text="6+" />
                  </Select>
                ) : (
                  profileData.numberOfCustomerProjects || 'Not set'
                )}
              </TableCell>

              <TableCell>
                {isEditing ? (
                  <Select
                    id="profile-self-assessment"
                    labelText="Self Assessment Level"
                    value={profileData.selfAssessLevelForSpeciality}
                    onChange={(e) => handleProfileChange('selfAssessLevelForSpeciality', e.target.value)}
                    hideLabel
                  >
                    <SelectItem value="" text="Select Self Assessment Level" />
                    <SelectItem value="L1" text="L1" />
                    <SelectItem value="L2" text="L2" />
                    <SelectItem value="L3" text="L3" />
                    <SelectItem value="L4" text="L4" />
                    <SelectItem value="L5" text="L5" />
                  </Select>
                ) : (
                  profileData.selfAssessLevelForSpeciality || 'Not set'
                )}
              </TableCell>

              <TableCell>
                {isEditing ? (
                  <Select
                    id="profile-professional-level"
                    labelText="Professional Level"
                    value={profileData.professionalLevel}
                    onChange={(e) => handleProfileChange('professionalLevel', e.target.value)}
                    hideLabel
                  >
                    <SelectItem value="" text="Select Professional Level" />
                    <SelectItem value="level 0" text="level 0" />
                    <SelectItem value="level 1" text="level 1" />
                    <SelectItem value="level 2" text="level 2" />
                    <SelectItem value="level 3" text="level 3" />
                    <SelectItem value="level 4" text="level 4" />
                  </Select>
                ) : (
                  profileData.professionalLevel || 'Not set'
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="profile-section mt-4">
        <h2>Project Experience</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>SNo</TableHeader>
              <TableHeader>Project Title</TableHeader>
              <TableHeader>Technologies</TableHeader>
              <TableHeader>Duration</TableHeader>
              <TableHeader>Responsibilities</TableHeader>
              <TableHeader>Client Tier</TableHeader>
              <TableHeader>Project Complexity</TableHeader>
              <TableHeader>Score</TableHeader>
              {isEditing && <TableHeader>Actions</TableHeader>}
            </TableRow>
          </TableHead>
          <TableBody>
            {profileData.projectExperiences.map((project, index) => (
              <TableRow key={project.id} style={
                project.id === deletingProjectId || isRemoved(project, removedProjectExperiences) ? { backgroundColor: '#ffeaea' } : {}
              }>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextInput
                      id={`project-title-${project.id}`}
                      labelText="Project Title"
                      value={project.projectTitle}
                      onChange={(e) => handleProjectChange(project.id, 'projectTitle', e.target.value)}
                      hideLabel
                    />
                  ) : (
                    project.projectTitle
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextInput
                      id={`project-tech-${project.id}`}
                      labelText="Technologies"
                      value={project.technologiesUsed}
                      onChange={(e) => handleProjectChange(project.id, 'technologiesUsed', e.target.value)}
                      hideLabel
                    />
                  ) : (
                    project.technologiesUsed
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      id={`project-duration-${project.id}`}
                      labelText="Duration"
                      value={project.duration || ''}
                      onChange={(e) => handleProjectChange(project.id, 'duration', e.target.value)}
                      hideLabel
                      required
                    >
                      <SelectItem value="" text="Select Duration" />
                      {durationOptions.map(opt => (
                        <SelectItem key={opt} value={opt} text={opt} />
                      ))}
                    </Select>
                  ) : (
                    project.duration || '-'
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      id={`project-resp-${project.id}`}
                      labelText="Responsibilities"
                      value={project.responsibilities || ''}
                      onChange={(e) => handleProjectChange(project.id, 'responsibilities', e.target.value)}
                      hideLabel
                      required
                    >
                      <SelectItem value="" text="Select Responsibilities" />
                      {responsibilitiesOptions.map(opt => (
                        <SelectItem key={opt} value={opt} text={opt} />
                      ))}
                    </Select>
                  ) : (
                    project.responsibilities || '-'
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      id={`project-client-tier-v2-${project.id}`}
                      labelText="Client Tier"
                      value={project.clientTierV2 || ''}
                      onChange={(e) => handleProjectChange(project.id, 'clientTierV2', e.target.value)}
                      hideLabel
                      required
                    >
                      <SelectItem value="" text="Select Client Tier" />
                      {clientTierOptions.map(opt => (
                        <SelectItem key={opt} value={opt} text={opt} />
                      ))}
                    </Select>
                  ) : (
                    project.clientTierV2 || '-'
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      id={`project-complexity-${project.id}`}
                      labelText="Project Complexity"
                      value={project.projectComplexity || ''}
                      onChange={(e) => handleProjectChange(project.id, 'projectComplexity', e.target.value)}
                      hideLabel
                      required
                    >
                      <SelectItem value="" text="Select Complexity" />
                      {projectComplexityOptions.map(opt => (
                        <SelectItem key={opt} value={opt} text={opt} />
                      ))}
                    </Select>
                  ) : (
                    project.projectComplexity || '-'
                  )}
                </TableCell>
                <TableCell>
                  {typeof project.projectScore === 'number' ? (
                    <Tag type="blue" size="md" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                      {project.projectScore.toFixed(2)}
                    </Tag>
                  ) : (
                    <Tag type="gray" size="md">-</Tag>
                  )}
                </TableCell>
                {isEditing && (
                  <TableCell>
                    <Button
                      kind="danger--ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {isEditing && newProject && (
              <TableRow key={newProject.id}>
                <TableCell>{profileData.projectExperiences.length + 1}</TableCell>
                <TableCell>
                  <TextInput
                    id={`new-project-title-${newProject.id}`}
                    labelText="Project Title"
                    value={newProject.projectTitle}
                    onChange={(e) => handleNewProjectChange('projectTitle', e.target.value)}
                    hideLabel
                  />
                </TableCell>
                <TableCell>
                  <TextInput
                    id={`new-project-tech-${newProject.id}`}
                    labelText="Technologies"
                    value={newProject.technologiesUsed}
                    onChange={(e) => handleNewProjectChange('technologiesUsed', e.target.value)}
                    hideLabel
                  />
                </TableCell>
                <TableCell>
                  <Select
                    id={`new-project-duration-${newProject.id}`}
                    labelText="Duration"
                    value={newProject.duration || ''}
                    onChange={(e) => handleNewProjectChange('duration', e.target.value)}
                    hideLabel
                    required
                  >
                    <SelectItem value="" text="Select Duration" />
                    {durationOptions.map(opt => (
                      <SelectItem key={opt} value={opt} text={opt} />
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    id={`new-project-resp-${newProject.id}`}
                    labelText="Responsibilities"
                    value={newProject.responsibilities || ''}
                    onChange={(e) => handleNewProjectChange('responsibilities', e.target.value)}
                    hideLabel
                    required
                  >
                    <SelectItem value="" text="Select Responsibilities" />
                    {responsibilitiesOptions.map(opt => (
                      <SelectItem key={opt} value={opt} text={opt} />
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    id={`new-project-client-tier-v2-${newProject.id}`}
                    labelText="Client Tier"
                    value={newProject.clientTierV2 || ''}
                    onChange={(e) => handleNewProjectChange('clientTierV2', e.target.value)}
                    hideLabel
                    required
                  >
                    <SelectItem value="" text="Select Client Tier" />
                    {clientTierOptions.map(opt => (
                      <SelectItem key={opt} value={opt} text={opt} />
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    id={`new-project-complexity-${newProject.id}`}
                    labelText="Project Complexity"
                    value={newProject.projectComplexity || ''}
                    onChange={(e) => handleNewProjectChange('projectComplexity', e.target.value)}
                    hideLabel
                    required
                  >
                    <SelectItem value="" text="Select Complexity" />
                    {projectComplexityOptions.map(opt => (
                      <SelectItem key={opt} value={opt} text={opt} />
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button kind="primary" size="sm" onClick={handleSaveNewProject}>
                    Add Project
                  </Button>{' '}
                  <Button kind="secondary" size="sm" onClick={handleCancelNewProject}>
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Composite Score Display */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#161616', marginRight: '0.5em' }}>
          Composite Score:
        </span>
        <Tag type="green" size="lg" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {compositeProjectExperience.toFixed(2)}
        </Tag>
      </div>

      <div className="profile-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Button
          kind="primary"
          onClick={() => {
            console.log('ProfilePage - Manage Skills button clicked');
            console.log('ProfilePage - Navigating to /skills');
            console.log('ProfilePage - Current URL:', window.location.href);
            console.log('ProfilePage - Current pathname:', window.location.pathname);
            
            // Set a flag to prevent redirect when navigating to skills page
            sessionStorage.setItem('userInitiatedNavigation', 'true');
            
            navigate('/skills');
          }}
          disabled={isNewUser && !isProfessionalInfoComplete()}
        >
          Manage Skills
        </Button>
        {isEditing && !newProject && (
          <Button kind="ghost" onClick={handleInitiateAddProject}>
            Add Project
          </Button>
        )}
      </div>

      {/* Inbox Modal */}
      <Modal
        open={inboxModalOpen}
        onRequestClose={() => setInboxModalOpen(false)}
        modalHeading="Messages"
        primaryButtonText="Close"
        onRequestSubmit={() => setInboxModalOpen(false)}
        size="md"
      >
        {(allMessages.length > 0 || unreadMessages.length > 0) ? (
          <div>
            {(unreadMessages.length > 0 ? unreadMessages : allMessages).map((message, index) => (
              <div key={index} style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1rem',
                backgroundColor: message.read ? '#f8f8f8' : '#fff3cd'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#da1e28' }}>Profile Rejection</h4>
                <p style={{ margin: '0', lineHeight: '1.5' }}>{message.reason}</p>
                <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                  Received: {new Date(message.createdAt).toLocaleDateString()}
                  {message.managerEmail && ` • From: ${message.managerEmail}`}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p>No messages.</p>
        )}
      </Modal>

      {showRejectModal && (
        <div className="rejection-modal-overlay">
          <div className="rejection-modal">
            <h3>Enter Reason for Rejection</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Reason is required..."
              className="rejection-textarea"
            />
            {rejectError && <div className="rejection-error">{rejectError}</div>}
            <div className="rejection-modal-actions">
              <Button kind="secondary" size="sm" onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectError(''); }}>Cancel</Button>
              <Button kind="danger" size="sm" onClick={() => {
                if (!rejectReason.trim()) {
                  setRejectError('Rejection reason is required.');
                  return;
                }
                setRejectError('');
                // Call the reject handler here (implement as needed)
                // onReject(rejectReason);
                setShowRejectModal(false);
                setRejectReason('');
              }}>Confirm Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

ProfilePage.propTypes = {
  userEmail: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default ProfilePage;