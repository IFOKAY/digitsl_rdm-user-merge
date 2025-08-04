import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Select, SelectItem } from '@carbon/react';
import axios from 'axios';

const ProfessionalCertificationForm = () => {
  const navigate = useNavigate();
  // Add certification level options
  const certificationLevelOptions = [
    'Foundation',
    'Experienced',
    'Expert',
    'Thought Leader'
  ];
  const [form, setForm] = useState({
    title: '',
    certified: '',
    certificationLink: '',
    certificationLevel: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title || form.certified === '' || !form.certificationLevel) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      const userRes = await axios.get('http://localhost:8082/api/user', { withCredentials: true });
      const userId = userRes.data.id;
      await axios.post('http://localhost:8082/api/professional-certifications', {
        userId,
        title: form.title,
        certified: form.certified === 'true',
        certificationLink: form.certificationLink,
        certificationLevel: form.certificationLevel
      });
      navigate('/skills');
    } catch (err) {
      setError('Failed to add professional certification.');
    }
  };

  return (
    <div className="form-container p-4 max-w-2xl mx-auto">
      <h2 className="mb-4 text-xl font-bold">Add Professional Certification</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          id="prof-cert-title"
          labelText="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Select
          id="prof-cert-certified"
          labelText="Certified?"
          name="certified"
          value={form.certified}
          onChange={handleChange}
          required
        >
          <SelectItem value="" text="Choose an option" />
          <SelectItem value="true" text="Yes" />
          <SelectItem value="false" text="No" />
        </Select>
        <Select
          id="prof-cert-certification-level"
          labelText="Certification Level"
          name="certificationLevel"
          value={form.certificationLevel}
          onChange={handleChange}
          required
        >
          <SelectItem value="" text="Select Certification Level" />
          {certificationLevelOptions.map(opt => (
            <SelectItem key={opt} value={opt} text={opt} />
          ))}
        </Select>
        <TextInput
          id="prof-cert-link"
          labelText="Certification Link (Optional)"
          name="certificationLink"
          value={form.certificationLink}
          onChange={handleChange}
        />
        <div className="flex gap-4 mt-6">
          <Button type="submit" kind="primary">Save</Button>
          <Button kind="secondary" type="button" onClick={() => navigate('/skills')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionalCertificationForm; 