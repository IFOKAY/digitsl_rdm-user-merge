// Mock database for development when MySQL is not available
const mockData = {
  practices: [
    { id: 1, name: 'Software Development', description: 'Building and maintaining software applications' },
    { id: 2, name: 'Data Science', description: 'Analyzing and interpreting complex data' },
    { id: 3, name: 'Cloud Computing', description: 'Designing and managing cloud infrastructure' },
    { id: 4, name: 'Cybersecurity', description: 'Protecting systems and data from threats' },
    { id: 5, name: 'AI/Machine Learning', description: 'Developing intelligent systems and algorithms' }
  ],
  
  practice_areas: [
    { id: 1, name: 'Frontend Development', description: 'User interface development', practice_id: 1 },
    { id: 2, name: 'Backend Development', description: 'Server-side development', practice_id: 1 },
    { id: 3, name: 'Mobile Development', description: 'Mobile app development', practice_id: 1 },
    { id: 4, name: 'Data Analytics', description: 'Data analysis and visualization', practice_id: 2 },
    { id: 5, name: 'Machine Learning', description: 'ML model development', practice_id: 2 },
    { id: 6, name: 'AWS Cloud', description: 'Amazon Web Services', practice_id: 3 },
    { id: 7, name: 'Azure Cloud', description: 'Microsoft Azure', practice_id: 3 }
  ],
  
  user_skills: [
    { id: 1, user_id: 1, skill_name: 'React', proficiency_level: 'Expert', practice_area_id: 1 },
    { id: 2, user_id: 1, skill_name: 'Node.js', proficiency_level: 'Advanced', practice_area_id: 2 },
    { id: 3, user_id: 1, skill_name: 'Python', proficiency_level: 'Intermediate', practice_area_id: 4 }
  ],
  
  users: [
    { 
      id: 1, 
      email: 'demo@ibm.com', 
      name: 'Demo User', 
      role: 'user',
      department: 'Technology',
      manager: 'manager@ibm.com',
      password: '$2a$10$example.hashed.password',
      created_at: new Date()
    }
  ],
  
  user_profiles: [
    {
      id: 1,
      email: 'demo@ibm.com',
      profile_data: JSON.stringify({
        name: 'Demo User',
        department: 'Technology',
        manager: 'manager@ibm.com',
        skills: [],
        certifications: [],
        highImpactAssets: []
      }),
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  
  professional_certifications: [
    { id: 1, user_id: 1, certification_name: 'AWS Certified Solutions Architect', issuer: 'Amazon', date_obtained: '2023-01-15' }
  ],
  
  high_impact_assets: [
    { id: 1, user_id: 1, asset_name: 'E-commerce Platform', description: 'Built scalable e-commerce solution', impact_level: 'High' }
  ],
  
  practice_product_technology: [
    { id: 1, name: 'React.js', type: 'Technology', practice_area_id: 1 },
    { id: 2, name: 'Express.js', type: 'Technology', practice_area_id: 2 },
    { id: 3, name: 'TensorFlow', type: 'Technology', practice_area_id: 5 }
  ],
  
  pending_approvals: [],
  
  user_messages: []
};

// Mock database functions
const mockDatabase = {
  execute: async (query, params = []) => {
    console.log('Mock DB Query:', query, params);
    
    // Simple query parsing for common patterns
    if (query.includes('SELECT * FROM practices')) {
      return [mockData.practices];
    }
    
    if (query.includes('SELECT * FROM practice_areas WHERE practice_id')) {
      const practiceId = params[0];
      const areas = mockData.practice_areas.filter(area => area.practice_id == practiceId);
      return [areas];
    }
    
    if (query.includes('SELECT * FROM practice_areas')) {
      return [mockData.practice_areas];
    }
    
    if (query.includes('SELECT * FROM user_skills')) {
      return [mockData.user_skills];
    }
    
    if (query.includes('SELECT * FROM users WHERE email')) {
      const email = params[0];
      const users = mockData.users.filter(user => user.email === email);
      return [users];
    }
    
    if (query.includes('SELECT * FROM user_profiles WHERE email')) {
      const email = params[0];
      const profiles = mockData.user_profiles.filter(profile => profile.email === email);
      return [profiles];
    }
    
    if (query.includes('SELECT * FROM professional_certifications WHERE user_id')) {
      const userId = params[0];
      const certs = mockData.professional_certifications.filter(cert => cert.user_id == userId);
      return [certs];
    }
    
    if (query.includes('SELECT * FROM high_impact_assets WHERE user_id')) {
      const userId = params[0];
      const assets = mockData.high_impact_assets.filter(asset => asset.user_id == userId);
      return [assets];
    }
    
    if (query.includes('SELECT * FROM practice_product_technology WHERE practice_area_id')) {
      const practiceAreaId = params[0];
      const tech = mockData.practice_product_technology.filter(item => item.practice_area_id == practiceAreaId);
      return [tech];
    }
    
    if (query.includes('SELECT * FROM pending_approvals')) {
      return [mockData.pending_approvals];
    }
    
    if (query.includes('SELECT COUNT(*) as count FROM user_messages')) {
      return [{ count: 0 }];
    }
    
    if (query.includes('SELECT * FROM user_messages')) {
      return [mockData.user_messages];
    }
    
    // For INSERT queries, return mock result
    if (query.includes('INSERT INTO')) {
      return [{ insertId: Date.now(), affectedRows: 1 }];
    }
    
    // For UPDATE queries, return mock result
    if (query.includes('UPDATE')) {
      return [{ affectedRows: 1 }];
    }
    
    // For DELETE queries, return mock result
    if (query.includes('DELETE')) {
      return [{ affectedRows: 1 }];
    }
    
    // Default empty result
    return [[]];
  },
  
  getConnection: async () => {
    return {
      release: () => console.log('Mock connection released')
    };
  }
};

module.exports = {
  pool: mockDatabase,
  testConnection: async () => {
    console.log('✅ Mock Database connected successfully');
    return true;
  }
};