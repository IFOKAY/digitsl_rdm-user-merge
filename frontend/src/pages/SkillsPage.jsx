import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Modal,
  TextInput,
  Select,
  SelectItem
} from '@carbon/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import axios from 'axios';
import { approvalService } from '../services/api';

const SkillsPage = () => {
  console.log('SkillsPage - Component rendered');
  console.log('SkillsPage - Current URL:', window.location.href);
  console.log('SkillsPage - Current pathname:', window.location.pathname);
  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([]);
  const [secondarySkills, setSecondarySkills] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [badges, setBadges] = useState([]);
  const [professionalCertifications, setProfessionalCertifications] = useState([]);
  const [showProfCertModal, setShowProfCertModal] = useState(false);
  const [profCertForm, setProfCertForm] = useState({ title: '', certified: '', certificationLink: '' });
  const [profCertError, setProfCertError] = useState(null);
  const [highImpactAssets, setHighImpactAssets] = useState([]);
  const [deletingCertificationId, setDeletingCertificationId] = useState(null);
  const [deletingSecondarySkillId, setDeletingSecondarySkillId] = useState(null);
  const [deletingProfessionalCertId, setDeletingProfessionalCertId] = useState(null);
  const [deletingHighImpactAssetId, setDeletingHighImpactAssetId] = useState(null);
  const [removedProductCertifications, setRemovedProductCertifications] = useState([]);
  const [removedAncillarySkills, setRemovedAncillarySkills] = useState([]);
  const [removedProfessionalCertifications, setRemovedProfessionalCertifications] = useState([]);
  const [removedBadges, setRemovedBadges] = useState([]);
  const [removedHighImpactAssets, setRemovedHighImpactAssets] = useState([]);
  const [globalExpiryDate, setGlobalExpiryDate] = useState(null);
  const [isManagerRedirect, setIsManagerRedirect] = useState(false);
  const [managerEmail, setManagerEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [savingStatus, setSavingStatus] = useState('');

  // Function to save manager's work-in-progress data
  const saveManagerWorkInProgress = async () => {
    if (!isManagerRedirect || !userEmail) return;
    
    try {
      setSavingStatus('Saving...');
      const profileData = {
        email: userEmail,
        name: userName,
        secondarySkills: secondarySkills,
        ancillarySkills: certifications,
        professionalCertifications: professionalCertifications,
        highImpactAssets: highImpactAssets,
        badges: badges,
        // Add empty values for required fields
        practiceId: null,
        practiceAreaId: null,
        practiceProductTechnologyId: null,
        projectsDone: '',
        selfAssessmentLevel: '',
        professionalLevel: ''
      };
      
      // Save to backend
      await axios.put(`http://localhost:8082/api/profile/${userEmail}`, profileData, { withCredentials: true });
      console.log('SkillsPage - Saved work-in-progress data for manager:', userEmail);
      setSavingStatus('Saved');
      
      // Clear the saved status after 2 seconds
      setTimeout(() => setSavingStatus(''), 2000);
    } catch (error) {
      console.error('SkillsPage - Failed to save work-in-progress data:', error);
      setSavingStatus('Save failed');
      
      // Clear the error status after 3 seconds
      setTimeout(() => setSavingStatus(''), 3000);
    }
  };

  const fetchSkillsData = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8082/api/profile/${email}`, { withCredentials: true });
      const profileData = response.data;

      const formattedSecondarySkills = (profileData.secondarySkills || []).map(skill => ({
        ...skill,
        practice: skill.practice || 'N/A',
        practiceArea: skill.practiceArea || 'N/A',
        productsTechnologies: skill.productsTechnologies || 'N/A'
      }));
      setSecondarySkills(formattedSecondarySkills);

      const userCertifications = (profileData.ancillarySkills || []).map(cert => ({
        id: cert.id,
        technology: cert.technology || 'N/A',
        product: cert.product || 'N/A',
        certified: cert.certified,
        link: cert.certificationLink || '',
        certificationLevel: cert.certificationLevel || 'N/A',
        recencyOfCertification: cert.recencyOfCertification || 'N/A',
        certificationScore: cert.certificationScore
      }));
      setCertifications(userCertifications);

      // Fetch professional certifications from profile data
      const formattedProfessionalCerts = (profileData.professionalCertifications || []).map(cert => ({
        ...cert,
        certificationScore: cert.certificationScore
      }));
      setProfessionalCertifications(formattedProfessionalCerts);

      // Fetch badges from profile data
      setBadges(profileData.badges || []);

      // Fetch high impact assets from profile data
      setHighImpactAssets(profileData.highImpactAssets || []);

      // Find the first non-empty expiry date from badges
      const expiryDate = (profileData.badges || []).find(b => b.credentialExpiryDate)?.credentialExpiryDate;
      setGlobalExpiryDate(expiryDate);

    } catch (err) {
      console.error('Failed to fetch skills data:', err);
      setError('Failed to load skills data.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to fetch pending approval for current user
  const fetchPendingApproval = async (email) => {
    try {
      // Find the pending approval for this user
      const approvalsRes = await axios.get('http://localhost:8082/api/pending-approvals');
      const approvals = approvalsRes.data;
      console.log('[DEBUG] All pending approvals:', approvals);
      const approval = approvals.find(a => a.email === email && a.status === 'Pending');
      console.log('[DEBUG] Found approval for email:', email, approval);
      if (approval) {
        const detailRes = await axios.get(`http://localhost:8082/api/pending-approvals/${approval.id}`);
        console.log('[DEBUG] Approval details:', detailRes.data);
        setRemovedProductCertifications(detailRes.data.removedProductCertifications || []);
        setRemovedAncillarySkills(detailRes.data.removedAncillarySkills || []);
        setRemovedProfessionalCertifications(detailRes.data.removedProfessionalCertifications || []);
        setRemovedBadges(detailRes.data.removedBadges || []);
        setRemovedHighImpactAssets(detailRes.data.removedHighImpactAssets || []);
        console.log('[DEBUG] Set removed lists:', {
          removedProductCertifications: detailRes.data.removedProductCertifications || [],
          removedAncillarySkills: detailRes.data.removedAncillarySkills || [],
          removedProfessionalCertifications: detailRes.data.removedProfessionalCertifications || [],
          removedBadges: detailRes.data.removedBadges || [],
          removedHighImpactAssets: detailRes.data.removedHighImpactAssets || []
        });
      } else {
        setRemovedProductCertifications([]);
        setRemovedAncillarySkills([]);
        setRemovedProfessionalCertifications([]);
        setRemovedBadges([]);
        setRemovedHighImpactAssets([]);
        console.log('[DEBUG] No pending approval found, cleared all removed lists');
      }
    } catch (err) {
      console.error('[DEBUG] Error fetching pending approval:', err);
      setRemovedProductCertifications([]);
      setRemovedAncillarySkills([]);
      setRemovedProfessionalCertifications([]);
      setRemovedBadges([]);
      setRemovedHighImpactAssets([]);
    }
  };

  useEffect(() => {
    console.log('SkillsPage - useEffect triggered');
    // Check for manager redirect
    const managerRedirect = sessionStorage.getItem('managerRedirect');
    const seamlessRedirect = sessionStorage.getItem('seamlessManagerRedirect');
    
    console.log('SkillsPage - Manager redirect check:', {
      managerRedirect,
      seamlessRedirect,
      currentUrl: window.location.href
    });
    
    if (managerRedirect === 'true' || seamlessRedirect === 'true') {
      // This is a manager redirect, use manager data from session storage
      console.log('SkillsPage - Manager redirect detected, using session storage data');
      setIsManagerRedirect(true);
      const managerEmail = sessionStorage.getItem('managerEmail');
      const managerName = sessionStorage.getItem('managerName');
      
      console.log('SkillsPage - Manager data from session storage:', {
        email: managerEmail,
        name: managerName
      });
      
      setUserEmail(managerEmail);
      setManagerEmail(managerEmail); // Store for back button
      setUserName(managerName || '');
      
      // Clear the redirect flags only if this is actually a redirect from manager UI
      // Don't clear them if this is a normal navigation within the same app
      if (window.location.href.includes('managerRedirect=true') || window.location.href.includes('seamlessManagerRedirect=true')) {
        sessionStorage.removeItem('managerRedirect');
        sessionStorage.removeItem('seamlessManagerRedirect');
      }
      
      // For manager redirects, try to fetch existing data if available
      const fetchManagerData = async () => {
        try {
          // Try to get existing profile data for the manager
          const existingProfileResponse = await axios.get(`http://localhost:8082/api/profile/${managerEmail}`, { withCredentials: true });
          const existingData = existingProfileResponse.data;
          
          if (existingData) {
            console.log('SkillsPage - Found existing data for manager:', existingData);
            // Set existing data
            setSecondarySkills(existingData.secondarySkills || []);
            setCertifications(existingData.ancillarySkills || []);
            setProfessionalCertifications(existingData.professionalCertifications || []);
            setBadges(existingData.badges || []);
            setHighImpactAssets(existingData.highImpactAssets || []);
          } else {
            console.log('SkillsPage - No existing data found for manager, starting fresh');
          }
        } catch (error) {
          console.log('SkillsPage - No existing profile found for manager, starting fresh:', error.message);
        }
        
        setLoading(false);
      };
      
      fetchManagerData();
    } else {
      // Normal user flow - fetch data from API
      console.log('SkillsPage - Normal user flow, fetching from API');
      axios.get('http://localhost:8082/api/user', { withCredentials: true })
        .then(res => {
          const email = res.data.email;
          console.log('SkillsPage - Got email from API:', email);
          setUserEmail(email);
          fetchSkillsData(email);
          fetchPendingApproval(email);
          // Removed separate fetch calls since they're now in fetchSkillsData
        })
        .catch(err => {
          console.error('Failed to fetch user email:', err);
          // Don't redirect to login for manager redirects
          const managerRedirect = sessionStorage.getItem('managerRedirect');
          if (!managerRedirect) {
            navigate('/login');
          }
        });
    }
  }, []);

  // Clear user initiated navigation flag when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if we're not navigating to another skills-related page
      if (!window.location.pathname.startsWith('/skills')) {
        sessionStorage.removeItem('userInitiatedNavigation');
      }
      
      // Save work-in-progress data when component unmounts
      if (isManagerRedirect && userEmail) {
        // Use a non-async approach for cleanup
        saveManagerWorkInProgress().catch(error => {
          console.error('Failed to save work-in-progress on unmount:', error);
        });
      }
    };
  }, [isManagerRedirect, userEmail]);

  // Auto-save work-in-progress data every 30 seconds for managers
  useEffect(() => {
    if (!isManagerRedirect || !userEmail) return;
    
    const interval = setInterval(() => {
      saveManagerWorkInProgress().catch(error => {
        console.error('Failed to auto-save work-in-progress:', error);
      });
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(interval);
  }, [isManagerRedirect, userEmail]);

  // Save work-in-progress data when skills data changes (debounced)
  useEffect(() => {
    if (!isManagerRedirect || !userEmail) return;
    
    const timeoutId = setTimeout(() => {
      saveManagerWorkInProgress().catch(error => {
        console.error('Failed to save work-in-progress on data change:', error);
      });
    }, 2000); // Save 2 seconds after data changes
    
    return () => clearTimeout(timeoutId);
  }, [secondarySkills, certifications, professionalCertifications, highImpactAssets, badges]);

  const confirmAndDelete = async (id, type) => {
    if (type === 'certification') setDeletingCertificationId(id);
    if (type === 'secondary') setDeletingSecondarySkillId(id);
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmDelete || !userEmail) {
      setDeletingCertificationId(null);
      setDeletingSecondarySkillId(null);
      return;
    }

    try {
      let updatedProfile = {};
      const response = await axios.get(`http://localhost:8082/api/profile/${userEmail}`, { withCredentials: true });
      const currentProfileData = response.data;

      if (type === 'certification') {
        const updatedCerts = (currentProfileData.ancillarySkills || [])
          .filter(cert => cert.id !== id);

        updatedProfile = {
          ...currentProfileData,
          ancillarySkills: updatedCerts
        };

        setCertifications(prev => prev.filter(cert => cert.id !== id));
      } else if (type === 'secondary') {
        const updatedSkills = secondarySkills.filter(skill => skill.id !== id);
        updatedProfile = {
          ...currentProfileData,
          secondarySkills: updatedSkills
        };

        setSecondarySkills(updatedSkills);
      }

      await axios.put(`http://localhost:8082/api/profile/${userEmail}`, updatedProfile, { withCredentials: true });
      alert(`${type === 'certification' ? 'Certification' : 'Secondary skill'} deleted successfully!`);
    } catch (error) {
      console.error('Failed to delete skill:', error);
      setError('Failed to delete skill.');
      alert('Failed to delete skill. Please try again.');
      if (userEmail) fetchSkillsData(userEmail); // revert
    }
    setDeletingCertificationId(null);
    setDeletingSecondarySkillId(null);
  };

  const handleSubmitForApproval = async () => {
    try {
      let functionalManagerEmail;
      
      if (isManagerRedirect) {
        // For manager redirects, we need to fetch their functional manager from IBM API
        try {
          const ibmProfileResponse = await axios.get(
            `https://w3-unified-profile-api.ibm.com/v3/profiles/${encodeURIComponent(userEmail)}/profile`
          );
          const ibmProfile = ibmProfileResponse.data;
          const content = ibmProfile.content || {};
          const functionalManager = content.functionalManager;
          
          if (functionalManager && functionalManager.preferredIdentity) {
            functionalManagerEmail = functionalManager.preferredIdentity;
            // Store it in session storage for future use
            sessionStorage.setItem('functionalManagerEmail', functionalManagerEmail);
          } else {
            alert('Functional manager information not found. Please contact your administrator.');
            return;
          }
        } catch (error) {
          console.error('Failed to fetch IBM profile for manager:', error);
          alert('Failed to fetch manager information. Please try again.');
          return;
        }
      } else {
        // Normal user flow
        functionalManagerEmail = sessionStorage.getItem('functionalManagerEmail');
      }
      
      console.log('Functional Manager Email:', functionalManagerEmail);
      
      if (!functionalManagerEmail) {
        alert('Functional manager email not found. Please refresh the page and try again.');
        return;
      }

      // Fetch the latest profile data
      let profileData;
      if (isManagerRedirect) {
        // For manager redirects, try to get existing profile or create basic structure
        try {
          const managerProfileResponse = await axios.get(`http://localhost:8082/api/manager-profile/${userEmail}`);
          profileData = {
            ...managerProfileResponse.data,
            secondarySkills: secondarySkills,
            ancillarySkills: certifications,
            professionalCertifications: professionalCertifications,
            highImpactAssets: highImpactAssets,
            badges: badges,
            // Add empty values for required fields
            practiceId: null,
            practiceAreaId: null,
            practiceProductTechnologyId: null,
            projectsDone: '',
            selfAssessmentLevel: '',
            professionalLevel: ''
          };
        } catch (error) {
          // If manager profile doesn't exist, create basic structure
          profileData = {
            email: userEmail,
            name: userName,
            secondarySkills: secondarySkills,
            ancillarySkills: certifications,
            professionalCertifications: professionalCertifications,
            highImpactAssets: highImpactAssets,
            badges: badges,
            // Add empty values for required fields
            practiceId: null,
            practiceAreaId: null,
            practiceProductTechnologyId: null,
            projectsDone: '',
            selfAssessmentLevel: '',
            professionalLevel: ''
          };
        }
      } else {
        // Normal user flow - fetch from API
        const response = await axios.get(`http://localhost:8082/api/profile/${userEmail}`, { withCredentials: true });
        profileData = response.data;
      }
      console.log('Profile data for submission:', profileData);

      // Transform the data to include display names for manager UI
      const transformedProfileData = {
        ...profileData,
        // Add display names for practice fields
        practice: profileData.practiceId ? await getPracticeName(profileData.practiceId) : '',
        specialtyArea: profileData.practiceAreaId ? await getPracticeAreaName(profileData.practiceAreaId) : '',
        practiceProductTechnology: profileData.practiceProductTechnologyId ? await getProductName(profileData.practiceProductTechnologyId) : '',
        numberOfCustomerProjects: profileData.projectsDone || '',
        selfAssessLevelForSpeciality: profileData.selfAssessmentLevel || '',
        professionalLevel: profileData.professionalLevel || '',
        // Transform secondary skills to match manager UI field names
        secondarySkills: (profileData.secondarySkills || []).map(skill => ({
          ...skill,
          products: skill.productsTechnologies || skill.products || 'N/A' // Map productsTechnologies to products
        })),
        // Transform certifications to ensure proper boolean handling
        ancillarySkills: (profileData.ancillarySkills || []).map(cert => ({
          ...cert,
          certified: cert.certified === true || cert.certified === 'true' // Ensure boolean consistency
        })),
        // Keep original IDs for reference
        practiceId: profileData.practiceId,
        practiceAreaId: profileData.practiceAreaId,
        practiceProductTechnologyId: profileData.practiceProductTechnologyId,
        projectsDone: profileData.projectsDone,
        selfAssessmentLevel: profileData.selfAssessmentLevel,
        // Add badges to the profile data
        badges: badges
      };
      
      const submissionData = {
        email: profileData.email,
        name: profileData.name,
        profileData: JSON.stringify(transformedProfileData),
        functionalManagerEmail: functionalManagerEmail
      };
      
      console.log('Submitting approval with data:', submissionData);
      console.log('Submission URL: http://localhost:8082/api/submit-for-approval');
      
      const result = await approvalService.submitForApproval(submissionData);
      console.log('Submission result:', result);
      
      if (!isManagerRedirect) {
        await fetchPendingApproval(profileData.email);
        await fetchSkillsData(profileData.email); // Refresh data to ensure proper red highlighting
      }
      
      alert('Profile submitted for manager approval!');
      navigate('/confirmation');
    } catch (err) {
      console.error('Failed to submit for approval:', err);
      console.error('Error details:', err.response?.data || err.message);
      alert('Failed to submit for approval: ' + (err.response?.data || err.message));
    }
  };

  // Helper functions to get display names
  const getPracticeName = async (practiceId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/practices`);
      const practice = response.data.find(p => p.id === practiceId);
      return practice ? practice.name : '';
    } catch (error) {
      console.error('Failed to fetch practice name:', error);
      return '';
    }
  };

  const getPracticeAreaName = async (practiceAreaId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/practices`);
      const practices = response.data;
      for (const practice of practices) {
        const practiceArea = practice.practiceAreas?.find(pa => pa.id === practiceAreaId);
        if (practiceArea) {
          return practiceArea.name;
        }
      }
      return '';
    } catch (error) {
      console.error('Failed to fetch practice area name:', error);
      return '';
    }
  };

  const getProductName = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/practices`);
      const practices = response.data;
      for (const practice of practices) {
        for (const practiceArea of practice.practiceAreas || []) {
          const product = practiceArea.products?.find(p => p.id === productId);
          if (product) {
            return product.product_name;
          }
        }
      }
      return '';
    } catch (error) {
      console.error('Failed to fetch product name:', error);
      return '';
    }
  };

  const handleProfCertChange = (e) => {
    const { name, value } = e.target;
    setProfCertForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfCertSubmit = async (e) => {
    e.preventDefault();
    setProfCertError(null);
    if (!profCertForm.title || profCertForm.certified === '') {
      setProfCertError('Please fill all required fields.');
      return;
    }
    try {
      // Get user id
      const userRes = await axios.get('http://localhost:8082/api/user', { withCredentials: true });
      const userId = userRes.data.id;
      await axios.post('http://localhost:8082/api/professional-certifications', {
        userId,
        title: profCertForm.title,
        certified: profCertForm.certified === 'true',
        certificationLink: profCertForm.certificationLink
      });
      setShowProfCertModal(false);
      setProfCertForm({ title: '', certified: '', certificationLink: '' });
      fetchProfessionalCertifications(userId);
    } catch (err) {
      setProfCertError('Failed to add professional certification.');
    }
  };

  // Add delete function for professional certifications
  const handleDeleteProfessionalCertification = async (id) => {
    setDeletingProfessionalCertId(id);
    const confirmDelete = window.confirm('Are you sure you want to delete this professional certification?');
    if (!confirmDelete) {
      setDeletingProfessionalCertId(null);
      return;
    }
    try {
      await axios.delete(`http://localhost:8082/api/professional-certifications/${id}`);
      // Refresh profile data
      if (userEmail) {
        fetchSkillsData(userEmail);
      }
    } catch (err) {
      alert('Failed to delete professional certification.');
    }
    setDeletingProfessionalCertId(null);
  };

  // Add delete function for high impact assets
  const handleDeleteHighImpactAsset = async (id) => {
    setDeletingHighImpactAssetId(id);
    const confirmDelete = window.confirm('Are you sure you want to delete this high impact asset?');
    if (!confirmDelete) {
      setDeletingHighImpactAssetId(null);
      return;
    }
    try {
      await axios.delete(`http://localhost:8082/api/high-impact-assets/${id}`);
      // Refresh profile data
      if (userEmail) {
        fetchSkillsData(userEmail);
      }
    } catch (err) {
      alert('Failed to delete high impact asset.');
    }
    setDeletingHighImpactAssetId(null);
  };

  const handleBackButton = () => {
    // Back button behavior - go to profile page
    // Clear the user initiated navigation flag when leaving skills page
    sessionStorage.removeItem('userInitiatedNavigation');
    navigate('/profile');
  };

  // Calculate composite score (average of all certification scores)
  const compositeCertScore =
    secondarySkills && secondarySkills.length > 0
      ? (
          secondarySkills
            .map((s) => (typeof s.certificationScore === 'number' ? s.certificationScore : 0))
            .reduce((a, b) => a + b, 0) /
          secondarySkills.length
        )
      : 0;

  // Helper to check if a row is in a removed list (by id or unique fields)
  const isRemoved = (row, removedList, idField = 'id') => {
    console.log('[DEBUG] isRemoved called with:', { row, removedList, idField });
    const result = removedList.some(removed => {
      if (row[idField] && removed[idField]) {
        const match = String(row[idField]) === String(removed[idField]);
        console.log('[DEBUG] Comparing IDs:', { rowId: row[idField], removedId: removed[idField], match });
        return match;
      }
      // fallback: compare all fields
      const jsonMatch = JSON.stringify(row) === JSON.stringify(removed);
      console.log('[DEBUG] JSON comparison:', { rowJson: JSON.stringify(row), removedJson: JSON.stringify(removed), match: jsonMatch });
      return jsonMatch;
    });
    console.log('[DEBUG] isRemoved result:', result);
    return result;
  };

  console.log('SkillsPage - Render state:', { loading, error, userEmail, isManagerRedirect });
  
  if (loading) {
    console.log('SkillsPage - Showing loading state');
    return <div className="p-4">Loading skills...</div>;
  }
  if (error) {
    console.log('SkillsPage - Showing error state:', error);
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="skills-container">
      <div className="skills-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            kind="ghost"
            hasIconOnly
            renderIcon={ArrowLeft}
            iconDescription="Back to Profile Page"
            onClick={handleBackButton}
            style={{ marginRight: '1rem' }}
          />
          <h1>Skills Management</h1>
          {isManagerRedirect && (
            <>
              <Tag type="blue" size="md" style={{ marginLeft: '1rem', fontWeight: 'bold' }}>
                Manager Mode
              </Tag>
              <Tag type="green" size="sm" style={{ marginLeft: '0.5rem' }}>
                Auto-save enabled
              </Tag>
            </>
          )}
        </div>
      </div>

      <div className="skills-section">
        <h2>Product Certifications</h2>
        {secondarySkills.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Practice</TableHeader>
                <TableHeader>Practice Area</TableHeader>
                <TableHeader>Products / Technologies</TableHeader>
                <TableHeader>Duration</TableHeader>
                <TableHeader>Roles & Responsibilities</TableHeader>
                <TableHeader>Certification Level</TableHeader>
                <TableHeader>Recency of Certification</TableHeader>
                <TableHeader>Score</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {secondarySkills.map((skill) => (
                <TableRow key={skill.id} style={
                  skill.id === deletingSecondarySkillId || isRemoved(skill, removedProductCertifications) ? { backgroundColor: '#ffeaea' } : {}
                }>
                  <TableCell>{skill.practice}</TableCell>
                  <TableCell>{skill.practiceArea}</TableCell>
                  <TableCell>{skill.productsTechnologies}</TableCell>
                  <TableCell>{skill.duration}</TableCell>
                  <TableCell>{skill.roles}</TableCell>
                  <TableCell>{skill.certificationLevel || '-'}</TableCell>
                  <TableCell>{skill.recencyOfCertification || '-'}</TableCell>
                  <TableCell>
                    {typeof skill.certificationScore === 'number' ? (
                      <Tag type="blue" size="md" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                        {skill.certificationScore.toFixed(2)}
                      </Tag>
                    ) : (
                      <Tag type="gray" size="md">-</Tag>
                    )}
                  </TableCell>
                  <TableCell>
                    <Trash2
                      size={18}
                      style={{ cursor: 'pointer', color: 'red', marginLeft: '16px' }}
                      onClick={() => confirmAndDelete(skill.id, 'secondary')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No Product Certifications added yet.</p>
        )}
        <Button
          kind="tertiary"
          onClick={() => navigate('/skills/form')}
          style={{ marginTop: '1rem' }}
        >
          Add Product Certification
        </Button>
      </div>

      {/* Composite Score Display for Product Certifications */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#161616', marginRight: '0.5em' }}>
          Composite Score:
        </span>
        <Tag type="green" size="lg" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {compositeCertScore.toFixed(2)}
        </Tag>
      </div>

      <div className="skills-section" style={{ marginTop: '2rem' }}>
        <h2>3rd Party Certifications</h2>
        {certifications.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Technology</TableHeader>
                <TableHeader>Product</TableHeader>
                <TableHeader>Certified</TableHeader>
                <TableHeader>Certification Link</TableHeader>
                <TableHeader>Certification Level</TableHeader>
                <TableHeader>Recency of Certification</TableHeader>
                <TableHeader>Score</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {certifications.map((cert) => (
                <TableRow key={cert.id} style={
                  cert.id === deletingCertificationId || isRemoved(cert, removedAncillarySkills) ? { backgroundColor: '#ffeaea' } : {}
                }>
                  <TableCell>{cert.technology}</TableCell>
                  <TableCell>{cert.product}</TableCell>
                  <TableCell>
                    {cert.certified ? <Tag type="green">Yes</Tag> : <Tag type="gray">No</Tag>}
                  </TableCell>
                  <TableCell>
                    {cert.link ? (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer">View</a>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{cert.certificationLevel || '-'}</TableCell>
                  <TableCell>{cert.recencyOfCertification || '-'}</TableCell>
                  <TableCell>
                    {typeof cert.certificationScore === 'number' ? (
                      <Tag type="blue" size="md" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                        {cert.certificationScore.toFixed(2)}
                      </Tag>
                    ) : (
                      <Tag type="gray" size="md">-</Tag>
                    )}
                  </TableCell>
                  <TableCell>
                    <Trash2
                      size={18}
                      style={{ cursor: 'pointer', color: 'red', marginLeft: '16px' }}
                      onClick={() => confirmAndDelete(cert.id, 'certification')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No certifications added yet.</p>
        )}
        <Button
          kind="tertiary"
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/skills/ancillary-form')}
        >
          Add Other Certifications
        </Button>
      </div>

      {/* Composite Score Display for 3rd Party Certifications */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#161616', marginRight: '0.5em' }}>
          Composite Score:
        </span>
        <Tag type="green" size="lg" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {certifications && certifications.length > 0
            ? (
                (
                  certifications
                    .map((c) => (typeof c.certificationScore === 'number' ? c.certificationScore : 0))
                    .reduce((a, b) => a + b, 0) / certifications.length
                ).toFixed(2)
              )
            : "0.00"
          }
        </Tag>
      </div>

      <div className="skills-section" style={{ marginTop: '2rem' }}>
        <h2>Professional Certifications</h2>
        {professionalCertifications.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Title</TableHeader>
                <TableHeader>Certified</TableHeader>
                <TableHeader>Certification Link</TableHeader>
                <TableHeader>Certification Level</TableHeader>
                <TableHeader>Score</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {professionalCertifications.map((cert) => (
                <TableRow key={cert.id} style={
                  cert.id === deletingProfessionalCertId || isRemoved(cert, removedProfessionalCertifications) ? { backgroundColor: '#ffeaea' } : {}
                }>
                  <TableCell>{cert.title}</TableCell>
                  <TableCell>{cert.certified ? <Tag type="green">Yes</Tag> : <Tag type="gray">No</Tag>}</TableCell>
                  <TableCell>
                    {cert.certificationLink ? (
                      <a href={cert.certificationLink} target="_blank" rel="noopener noreferrer">View</a>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{cert.certificationLevel || '-'}</TableCell>
                  <TableCell>
                    {typeof cert.certificationScore === 'number' ? (
                      <Tag type="blue" size="md" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                        {cert.certificationScore.toFixed(2)}
                      </Tag>
                    ) : (
                      <Tag type="gray" size="md">-</Tag>
                    )}
                  </TableCell>
                  <TableCell>
                    <Trash2
                      size={18}
                      style={{ cursor: 'pointer', color: 'red', marginLeft: '16px' }}
                      onClick={() => handleDeleteProfessionalCertification(cert.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No professional certifications added yet.</p>
        )}
        <Button
          kind="tertiary"
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/skills/professional-form')}
        >
          Add Professional Certification
        </Button>
      </div>

      {/* Composite Score Display for Professional Certifications */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#161616', marginRight: '0.5em' }}>
          Composite Score:
        </span>
        <Tag type="green" size="lg" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {professionalCertifications && professionalCertifications.length > 0
            ? (
                (
                  professionalCertifications
                    .map((c) => (typeof c.certificationScore === 'number' ? c.certificationScore : 0))
                    .reduce((a, b) => a + b, 0) / professionalCertifications.length
                ).toFixed(2)
              )
            : "0.00"
          }
        </Tag>
      </div>

      <div className="skills-section" style={{ marginTop: '2rem' }}>
        <h2>Badges</h2>
        {badges.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Credential Title</TableHeader>
                <TableHeader>Credential Type</TableHeader>
                <TableHeader>Learning Source</TableHeader>
                <TableHeader>Credential Status</TableHeader>
                <TableHeader>Credential Date</TableHeader>
                <TableHeader>Credential Expiry Date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {badges.map((badge, idx) => (
                <TableRow key={idx} style={isRemoved(badge, removedBadges, 'credentialOrderId') ? { backgroundColor: '#ffeaea' } : {}}>
                  <TableCell>
                    {badge.credentialOrderId ? (
                      <a
                        href={`https://www.credly.com/badges/${badge.credentialOrderId.replace(/^CREDLY-/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {badge.credentialLabel ? badge.credentialLabel.replace(/\s*\(.*\)$/, '') : '-'}
                      </a>
                    ) : (
                      badge.credentialLabel ? badge.credentialLabel.replace(/\s*\(.*\)$/, '') : '-'
                    )}
                  </TableCell>
                  <TableCell>{badge.credentialType}</TableCell>
                  <TableCell>{badge.learningSource}</TableCell>
                  <TableCell>{badge.credentialStatus}</TableCell>
                  <TableCell>{badge.credentialDate ? badge.credentialDate.substring(0, 10) : '-'}</TableCell>
                  <TableCell>{badge.credentialExpiryDate ? badge.credentialExpiryDate.substring(0, 10) : (globalExpiryDate ? globalExpiryDate.substring(0, 10) : '-')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No badges found.</p>
        )}
      </div>

      <div className="skills-section" style={{ marginTop: '2rem' }}>
        <h2>High Impact Assets and Accelerators</h2>
        {highImpactAssets.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Title</TableHeader>
                <TableHeader>Business Impact</TableHeader>
                <TableHeader>Visibility / Adoption</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Score</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {highImpactAssets.map((asset) => (
                <TableRow key={asset.id} style={
                  asset.id === deletingHighImpactAssetId || isRemoved(asset, removedHighImpactAssets) ? { backgroundColor: '#ffeaea' } : {}
                }>
                  <TableCell>{asset.title}</TableCell>
                  <TableCell>{asset.businessImpact}</TableCell>
                  <TableCell>{asset.visibilityAdoption}</TableCell>
                  <TableCell>{asset.description}</TableCell>
                  <TableCell>
                    {typeof asset.impactScore === 'number' ? (
                      <Tag type="blue" size="md" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                        {asset.impactScore.toFixed(2)}
                      </Tag>
                    ) : (
                      <Tag type="gray" size="md">-</Tag>
                    )}
                  </TableCell>
                  <TableCell>
                    <Trash2
                      size={18}
                      style={{ cursor: 'pointer', color: 'red', marginLeft: '16px' }}
                      onClick={() => handleDeleteHighImpactAsset(asset.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No high impact assets or accelerators added yet.</p>
        )}
        <Button
          kind="tertiary"
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/skills/high-impact-asset-form')}
        >
          Add High Impact Asset
        </Button>
      </div>

      {/* Composite Score Display for High Impact Assets and Accelerators */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#161616', marginRight: '0.5em' }}>
          Composite Score:
        </span>
        <Tag type="green" size="lg" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {highImpactAssets && highImpactAssets.length > 0
            ? (
                (
                  highImpactAssets
                    .map((a) => (typeof a.impactScore === 'number' ? a.impactScore : 0))
                    .reduce((a, b) => a + b, 0) / highImpactAssets.length
                ).toFixed(2)
              )
            : "0.00"
          }
        </Tag>
      </div>

      <div className="skills-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isManagerRedirect && (
          <>
            <Button
              kind="secondary"
              onClick={() => {
                saveManagerWorkInProgress().catch(error => {
                  console.error('Failed to save work-in-progress manually:', error);
                });
              }}
            >
              Save Work in Progress
            </Button>
            {savingStatus && (
              <span style={{ 
                fontSize: '0.875rem', 
                color: savingStatus === 'Saved' ? '#24a148' : savingStatus === 'Save failed' ? '#da1e28' : '#0f62fe',
                fontWeight: '500'
              }}>
                {savingStatus}
              </span>
            )}
          </>
        )}
        <Button
          kind="primary"
          onClick={handleSubmitForApproval}
        >
          Submit Updates For Manager validation
        </Button>
      </div>
    </div>
  );
};

export default SkillsPage;
