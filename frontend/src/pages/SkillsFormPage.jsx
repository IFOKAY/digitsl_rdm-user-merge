import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, TextArea, Select, SelectItem } from '@carbon/react';
import axios from 'axios';

const SecondarySkillsForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    practice: '',
    practiceArea: '',
    product: '',
    duration: '',
    roles: '',
    certificationLevel: '',
    recencyOfCertification: ''
  });

  const [practices, setPractices] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [products, setProducts] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState(null);

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

  // Fetch authenticated user email on mount
  useEffect(() => {
    axios.get('http://localhost:8082/api/user', { withCredentials: true })
      .then((res) => {
        setUserEmail(res.data.email);
      })
      .catch((err) => {
        console.error('Failed to fetch user:', err);
        navigate('/login');
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8082/api/practices')
      .then(res => setPractices(res.data))
      .catch(err => {
        console.error('Failed to fetch practices:', err);
        setError('Failed to load practices. Please try again.');
      });
  }, []);

  useEffect(() => {
    if (form.practice) {
      axios.get(`http://localhost:8082/api/practice-areas/practice/${form.practice}`)
        .then(res => setPracticeAreas(res.data))
        .catch(err => {
          console.error('Failed to fetch practice areas:', err);
          setError('Failed to load practice areas. Please try again.');
        });
      setForm(f => ({ ...f, practiceArea: '', product: '' }));
      setProducts([]);
    }
  }, [form.practice]);

  useEffect(() => {
    if (form.practiceArea) {
      axios.get(`http://localhost:8082/api/practice-product-technology/practice-area/${form.practiceArea}`)
        .then(res => setProducts(res.data))
        .catch(err => {
          console.error('Failed to fetch products:', err);
          setError('Failed to load products. Please try again.');
        });
      setForm(f => ({ ...f, product: '' }));
    }
  }, [form.practiceArea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!userEmail) {
        navigate('/login');
        return;
      }

      const newSkill = {
        id: `temp-${Date.now()}`,
        practice: practices.find(p => String(p.id) === form.practice)?.name || '',
        practiceArea: practiceAreas.find(pa => String(pa.id) === form.practiceArea)?.name || '',
        productsTechnologies: products.find(p => String(p.id) === form.product)?.product_name || '',
        duration: form.duration,
        roles: form.roles,
        certificationLevel: form.certificationLevel,
        recencyOfCertification: form.recencyOfCertification
      };

      // Get existing profile
      const response = await axios.get(`http://localhost:8082/api/profile/${userEmail}`, {
        withCredentials: true,
      });
      const currentProfileData = response.data;

      // Update profile with new skill
      const updatedProfile = {
        ...currentProfileData,
        secondarySkills: [...(currentProfileData.secondarySkills || []), newSkill]
      };

      // Send update with CSRF token
      await axios.put(
        `http://localhost:8082/api/profile/${userEmail}`,
        updatedProfile,
        {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': getCsrfTokenFromCookie()
          }
        }
      );

      alert('Secondary skill added successfully!');
      navigate('/skills');
      window.location.reload();
    } catch (err) {
      console.error('Failed to add secondary skill:', err);
      setError('Failed to add secondary skill. Please try again.');
    }
  };

  return (
    <div className="form-container p-4 max-w-2xl mx-auto">
      <h2 className="mb-4 text-xl font-bold">Add Product Certification</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          id="secondary-skill-practice"
          labelText="Practice"
          name="practice"
          value={form.practice}
          onChange={handleChange}
          required
        >
          <SelectItem value="" text="Select Practice" />
          {practices.map((p) => (
            <SelectItem key={p.id} value={String(p.id)} text={p.name} />
          ))}
        </Select>
        <Select
          id="secondary-skill-practice-area"
          labelText="Practice Area"
          name="practiceArea"
          value={form.practiceArea}
          onChange={handleChange}
          required
          disabled={!form.practice}
        >
          <SelectItem value="" text="Select Practice Area" />
          {practiceAreas.map((pa) => (
            <SelectItem key={pa.id} value={String(pa.id)} text={pa.name} />
          ))}
        </Select>
        <Select
          id="secondary-skill-product-technology"
          labelText="Product/Technology"
          name="product"
          value={form.product}
          onChange={handleChange}
          required
          disabled={!form.practiceArea}
        >
          <SelectItem value="" text="Select Product/Technology" />
          {products.map((prod) => (
            <SelectItem key={prod.id} value={String(prod.id)} text={prod.product_name} />
          ))}
        </Select>
        <TextInput
          id="secondary-skill-duration"
          labelText="Duration"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          required
        />
        <TextArea
          id="secondary-skill-roles"
          labelText="Roles & Responsibilities"
          name="roles"
          value={form.roles}
          onChange={handleChange}
          required
        />
        <Select
          id="secondary-skill-certification-level"
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
        <Select
          id="secondary-skill-recency-of-certification"
          labelText="Recency of Certification"
          name="recencyOfCertification"
          value={form.recencyOfCertification}
          onChange={handleChange}
          required
        >
          <SelectItem value="" text="Select Recency" />
          {recencyOfCertificationOptions.map(opt => (
            <SelectItem key={opt} value={opt} text={opt} />
          ))}
        </Select>
        <div className="flex gap-4">
          <Button type="submit">Save</Button>
          <Button kind="secondary" onClick={() => navigate('/skills')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default SecondarySkillsForm;
