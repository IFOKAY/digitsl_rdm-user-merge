import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Form, Stack, TextInput, Select, SelectItem
} from '@carbon/react';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { userService } from '../services/api'; // Ensure this supports getProfile/updateProfile

const AncillaryFormPage = () => {
  const navigate = useNavigate();
  // Add certification level options
  const certificationLevelOptions = [
    'none',
    'foundation',
    'associate',
    'professional',
    'advanced',
    'Expert / master'
  ];

  // Add recency of certification options
  const recencyOfCertificationOptions = [
    '2 – 3 years',
    '1.5 – 2 years',
    '1 year',
    '<6 months',
    '<3 months'
  ];
  const [formData, setFormData] = useState({
    technology: '',
    product: '',
    certified: '',
    certificationLink: '',
    certificationLevel: '',
    recencyOfCertification: ''
  });
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // ✅ Fetch email from backend, not localStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8082/api/user', {
          withCredentials: true,
        });
        if (res.data?.email) {
          setUserEmail(res.data.email);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('User fetch failed:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Extra validation for required fields
    if (!formData.technology || !formData.product || formData.certified === '') {
      setError('Please fill all required fields.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8082/api/user/${userEmail}/ancillary-skill`,
        {
        technology: formData.technology,
        product: formData.product,
        certified: formData.certified === 'true',
        certificationLink: formData.certificationLink || '',
        certificationLevel: formData.certificationLevel,
        recencyOfCertification: formData.recencyOfCertification
        },
        { withCredentials: true }
      );
      alert('Certification added successfully!');
      navigate('/skills');
    } catch (err) {
      console.error('Failed to add certification:', err);
      setError('Failed to add certification. Please try again.');
    }
  };

  return (
    <div className="skills-container">
      <div className="skills-header">
        <div className="flex items-center">
          <Button 
            kind="ghost" hasIconOnly renderIcon={ArrowLeft} 
            iconDescription="Back" onClick={() => navigate('/skills')} 
            style={{ marginRight: '1rem' }} 
          />
          <h1>Add Ancillary Skill</h1>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <Form onSubmit={handleSubmit}>
        <Stack gap={7}>
          <TextInput
            id="technology"
            labelText="Technology"
            placeholder="e.g., Cloud, DevOps"
            name="technology"
            value={formData.technology}
            onChange={handleChange}
            required
          />
          <TextInput
            id="product"
            labelText="Product"
            placeholder="e.g., AWS, Kubernetes"
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
          />
          <Select
            id="certified"
            labelText="Certified?"
            name="certified"
            value={formData.certified}
            onChange={handleChange}
            required
          >
            <SelectItem value="" text="Choose an option" />
            <SelectItem value="true" text="Yes" />
            <SelectItem value="false" text="No" />
          </Select>
          <Select
            id="certificationLevel"
            labelText="Certification Level"
            name="certificationLevel"
            value={formData.certificationLevel}
            onChange={handleChange}
            required
          >
            <SelectItem value="" text="Select Certification Level" />
            {certificationLevelOptions.map(opt => (
              <SelectItem key={opt} value={opt} text={opt} />
            ))}
          </Select>
          <Select
            id="recencyOfCertification"
            labelText="Recency of Certification"
            name="recencyOfCertification"
            value={formData.recencyOfCertification}
            onChange={handleChange}
            required
          >
            <SelectItem value="" text="Select Recency" />
            {recencyOfCertificationOptions.map(opt => (
              <SelectItem key={opt} value={opt} text={opt} />
            ))}
          </Select>
          <TextInput
            id="certificationLink"
            labelText="Certification Link (Optional)"
            placeholder="e.g., https://example.com"
            name="certificationLink"
            value={formData.certificationLink}
            onChange={handleChange}
          />
          <div className="skills-actions">
            <Button kind="secondary" onClick={() => navigate('/skills')} style={{ marginRight: '1rem' }}>
              Cancel
            </Button>
            <Button type="submit" kind="primary">
              Save
            </Button>
          </div>
        </Stack>
      </Form>
    </div>
  );
};

export default AncillaryFormPage;
