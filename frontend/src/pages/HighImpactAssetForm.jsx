import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Select, SelectItem, TextArea } from '@carbon/react';
import axios from 'axios';

const businessImpactOptions = [
  'No Impact',
  'Local utility (project specific and not much scope for reuse)',
  'Productivity Enhancer',
  'Department wide efficiency',
  'Major $/Time savings',
  'Strategic Transformation / FOAK'
];

const visibilityAdoptionOptions = [
  'Internal (not client shareable)',
  '2 to 4 Client deployments',
  '5 to 8 Client deployments',
  '9+Client deployments',
  'Primary deal WIN driver'
];

const HighImpactAssetForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    businessImpact: '',
    visibilityAdoption: '',
    description: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.businessImpact || !form.visibilityAdoption) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      const userRes = await axios.get('http://localhost:8082/api/user', { withCredentials: true });
      const userId = userRes.data.id;
      await axios.post('http://localhost:8082/api/high-impact-assets', {
        userId,
        title: form.title,
        businessImpact: form.businessImpact,
        visibilityAdoption: form.visibilityAdoption,
        description: form.description
      });
      navigate('/skills');
    } catch (err) {
      setError('Failed to add high impact asset.');
    }
  };

  return (
    <div className="form-container p-4 max-w-2xl mx-auto">
      <h2 className="mb-4 text-xl font-bold">Add High Impact Asset / Accelerator</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          id="asset-title"
          labelText="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Select
          id="asset-business-impact"
          labelText="Business Impact"
          name="businessImpact"
          value={form.businessImpact}
          onChange={handleChange}
          required
        >
          <SelectItem value="" text="Choose an option" />
          {businessImpactOptions.map(opt => (
            <SelectItem key={opt} value={opt} text={opt} />
          ))}
        </Select>
        <Select
          id="asset-visibility-adoption"
          labelText="Visibility / Adoption"
          name="visibilityAdoption"
          value={form.visibilityAdoption}
          onChange={handleChange}
          required
        >
          <SelectItem value="" text="Choose an option" />
          {visibilityAdoptionOptions.map(opt => (
            <SelectItem key={opt} value={opt} text={opt} />
          ))}
        </Select>
        <TextArea
          id="asset-description"
          labelText="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <div className="flex gap-4 mt-6">
          <Button type="submit" kind="primary">Save</Button>
          <Button kind="secondary" type="button" onClick={() => navigate('/skills')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default HighImpactAssetForm; 