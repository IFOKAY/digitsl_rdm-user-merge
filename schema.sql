create Database test1;
use test1;

-- User Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    slack_id VARCHAR(100)
);

drop table if exists users;


-- Create practice table

CREATE TABLE practice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(512) NOT NULL UNIQUE,
    description VARCHAR(2056)
);





-- Create practice_area table

CREATE TABLE practice_area (
    id INT AUTO_INCREMENT PRIMARY KEY,
    practice_id INT NOT NULL,
    name VARCHAR(512) NOT NULL,
    description VARCHAR(2056),
    FOREIGN KEY (practice_id) REFERENCES practice(id)
);




-- Create practice_product_technology table
CREATE TABLE practice_product_technology (
    id INT AUTO_INCREMENT PRIMARY KEY,
    practice_area_id INT NOT NULL,
    product_name VARCHAR(512) NOT NULL,
    technology_name VARCHAR(512),
    FOREIGN KEY (practice_area_id) REFERENCES practice_area(id)
);






-- User_skill Table
CREATE TABLE user_skill (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,
  practice_id INT ,
  practice_area_id INT NOT NULL,
  practice_product_technology_id INT NOT NULL,

  projects_done VARCHAR(10),  -- Values like '1-3', '4-5', etc.
  self_assessment_level VARCHAR(5), -- e.g., 'L2', 'L3'
  professional_level VARCHAR(20),   -- e.g., 'level 2', 'level 3'

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (practice_id) REFERENCES practice(id),
  FOREIGN KEY (practice_area_id) REFERENCES practice_area(id),
  FOREIGN KEY (practice_product_technology_id) REFERENCES practice_product_technology(id)
);




-- User_skill_info Table

CREATE TABLE user_skill_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT not null,
    user_skill_id INT not null,
    project_title VARCHAR(512),
    technologies_used VARCHAR(512),
    duration VARCHAR(50),
    responsibilities VARCHAR(1024),
    client_tier VARCHAR(50),
    client_tier_v2 VARCHAR(50),
    project_complexity VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (user_skill_id) REFERENCES user_skill(id)
);




-- User_Secondary_skill

CREATE TABLE user_secondary_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT not null,
    practice VARCHAR(100),
    practice_area VARCHAR(100),
    products_technologies VARCHAR(512),
    duration VARCHAR(50),
    roles VARCHAR(512),
    certification_level VARCHAR(100),
    recency_of_certification VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);



-- User_ancillary_skills Table
CREATE TABLE user_ancillary_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT not null,
    technology VARCHAR(512),
    product VARCHAR(512),
    certified BOOLEAN DEFAULT FALSE,
    certification_link VARCHAR(1024),
    certification_level VARCHAR(100),
    recency_of_certification VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS professional_certifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    certified BOOLEAN,
    certification_link VARCHAR(512),
    certification_level VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User_Credentials
CREATE TABLE user_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    employee_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    
    credential_order_id VARCHAR(100),
    credential_date DATE,
    digital_credential_id VARCHAR(100),
    credential_label VARCHAR(512),
    credential_type VARCHAR(100),
    learning_source VARCHAR(100),
    credential_expiry_date DATE,
    credential_status VARCHAR(50),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001RQ744',
    (SELECT id FROM users WHERE email = 'DEEPIKA.S.U@ibm.com' LIMIT 1),
    'CREDLY-e25d5508-57d0-4e34-8685-105d8c79a079',
    '2025-04-10',
    'CREDLY-5eef1a66-1a37-42cc-940a-e7160661810a',
    'Containers & Kubernetes Essentials (CREDLY-5eef1a66-1a37-42cc-940a-e7160661810a)',
    'Skill credential',
    'Credly',
    NULL,
    'Issued'
);


INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES 
(
    'A001RQ744',
    (SELECT id FROM users WHERE email = 'DEEPIKA.S.U@ibm.com' LIMIT 1),
    'CREDLY-646d06af-119b-4995-8d63-1f68684feb99',
    '2025-04-25',
    'CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95',
    'IBM Cloud Advocate Essentials (CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95)',
    'Knowledge credential',
    'Credly',
    NULL,
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001RQ744',
    (SELECT id FROM users WHERE email = 'DEEPIKA.S.U@ibm.com' LIMIT 1),
    'CREDLY-1856d145-6a9c-4ae3-94d2-3c9ac77c142b',
    '2025-03-26',
    'CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6',
    'IBM Growth Behaviors (CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6)',
    'Skill credential',
    'Credly',
    '2035-03-26',
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001R5744',
    (SELECT id FROM users WHERE email = 'NIRAJAN_K@ibm.com' LIMIT 1),
    'CREDLY-756dfe5b-427e-4ac3-8509-e11aca979f65',
    '2025-04-21',
    'CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95',
    'IBM Cloud Advocate Essentials (CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95)',
    'Knowledge credential',
    'Credly',
    NULL,
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001R5744',
    (SELECT id FROM users WHERE email = 'NIRAJAN_K@ibm.com' LIMIT 1),
    'CREDLY-083672ff-cbf1-46b1-8e6e-d35558804955',
    '2025-03-25',
    'CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6',
    'IBM Growth Behaviors (CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6)',
    'Skill credential',
    'Credly',
    '2035-03-25',
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001S4744',
    (SELECT id FROM users WHERE email = 'RESHMI_PANDA@ibm.com' LIMIT 1),
    'CREDLY-e0c340fc-747f-4b7b-9546-ae60af91cf51',
    '2025-04-16',
    'CREDLY-5eef1a66-1a37-42cc-940a-e7160661810a',
    'Containers & Kubernetes Essentials (CREDLY-5eef1a66-1a37-42cc-940a-e7160661810a)',
    'Skill credential',
    'Credly',
    NULL,
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001S4744',
    (SELECT id FROM users WHERE email = 'RESHMI_PANDA@ibm.com' LIMIT 1),
    'CREDLY-28f22471-ebdd-4d16-9151-9faccd7d0324',
    '2025-05-11',
    'CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95',
    'IBM Cloud Advocate Essentials (CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95)',
    'Knowledge credential',
    'Credly',
    NULL,
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001S4744',
    (SELECT id FROM users WHERE email = 'RESHMI_PANDA@ibm.com' LIMIT 1),
    'CREDLY-dd1becb1-c046-471e-a625-36bf4440bbe3',
    '2025-03-25',
    'CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6',
    'IBM Growth Behaviors (CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6)',
    'Skill credential',
    'Credly',
    '2035-03-25',
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001RZ744',
    (SELECT id FROM users WHERE email = 'sandeep.p2@ibm.com' LIMIT 1),
    'CREDLY-810a76e3-a96c-482a-9e94-d53c6a90dfd8',
    '2025-04-09',
    'CREDLY-5eef1a66-1a37-42cc-940a-e7160661810a',
    'Containers & Kubernetes Essentials (CREDLY-5eef1a66-1a37-42cc-940a-e7160661810a)',
    'Skill credential',
    'Credly',
    NULL,
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001RZ744',
    (SELECT id FROM users WHERE email = 'sandeep.p2@ibm.com' LIMIT 1),
    'CREDLY-15f29201-8f26-4e3a-8d1c-590f9efd0a28',
    '2025-04-01',
    'CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95',
    'IBM Cloud Advocate Essentials (CREDLY-eb472dbc-7bba-454a-b3b7-86f6e64e9e95)',
    'Knowledge credential',
    'Credly',
    NULL,
    'Issued'
);

INSERT INTO user_credentials (
    employee_id, user_id, credential_order_id, credential_date,
    digital_credential_id, credential_label, credential_type,
    learning_source, credential_expiry_date, credential_status
) VALUES (
    'A001RZ744',
    (SELECT id FROM users WHERE email = 'sandeep.p2@ibm.com' LIMIT 1),
    'CREDLY-eb455926-15ef-4cfa-80f9-97d3cd9142d3',
    '2025-03-25',
    'CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6',
    'IBM Growth Behaviors (CREDLY-06dd24c7-5946-4ac3-b4aa-fd6c902e0ca6)',
    'Skill credential',
    'Credly',
    '2035-03-25',
    'Issued'
);


