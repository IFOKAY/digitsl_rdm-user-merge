-- Insert for users

INSERT INTO users (name, email, slack_id) VALUES
('Sandeep P', 'SANDEEP.P2@ibm.com', 'Sandeep_p@slack'),
('Deepika S U', 'DEEPIKA.S.U@ibm.com', 'Deepika_S_U@slack'),
('Reshmi Panda', 'RESHMI_PANDA@ibm.com', 'Reshmi@slack'),
('Nirajan K', 'NIRAJAN_K@ibm.com', 'Nirajan_k@slack'),
('Kausal SD', 'Kausal.SD@ibm.com', 'kausal_sd@slack'),
('Name6', 'Name6@somedummydata.com', 'slk_j1KpAz'),
('Name7', 'Name7@somedummydata.com', 'slk_b8TnWy'),
('Name8', 'Name8@somedummydata.com', 'slk_h2KrLo'),
('Name9', 'Name9@somedummydata.com', 'slk_x4WqEm'),
('Pawan Kumar','PawanKumar@ibm.com','Pawan@slackid');

drop table if exists users;


-- Insert values for Practice
INSERT INTO practice (name) VALUES
('Data and AI'),
('Automation'),
('SCBN'),
('Infrastructure'),
('EC and EM'),
('Network and Security');

-- Insert values for Practice_area

INSERT INTO practice_area (name, practice_id) VALUES
('Additional products', 1),
('AI Assistants', 1),
('AI Governance', 1),
('AI Tools', 1),
('Application Development', 2),
('Application Integration', 2),
('Asset Lifecycle. Mgtm.', 2),
('Asset LifeCylce Mgmt. & B2B Integration', 2),
('Business Analytics', 2),
('Content Management', 2),
('Data Integration', 3),
('Data Intelligence', 3),
('Data Intelligence2', 3),
('Data Lakehouse', 3),
('Data Security', 3),
('DataBases', 3),
('IBM Cloud', 4),
('IBM Storage', 4),
('Indentity & Access Mgmt.', 4),
('Network Mgmt.', 4),
('Observability', 4),
('Power', 5),
('Security', 6),
('Workflow Automation', 6),
('zAIOps', 6),
('zDevOps', 6),
('zHW', 6),
('zHybrid Cloud', 6);

-- Values for Practice_product_techmology
-- Additional_product
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('OpenPages', 1);

-- Products under AI Assistants

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('watsonx Assistant', 2),
('Watsonx Orchestrate', 2);


-- Products under AI Governance

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('watsonx.gov', 3);


-- Products under AI Tools

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('watsonx.ai', 4);


-- Application_Development

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Runtime for Java', 5),
('WebSphere', 5);


-- Application Integration

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('API Connect 2.0', 6),
('App Connect', 6),
('Cloud Pak for Integration', 6),
('DataPower Solutions', 6),
('MQ', 6),
('webMethods', 6);


-- Asset Lifecycle. Mgtm.

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Envizi', 7),
('Maximo', 7);


-- Asset LifeCylce Mgmt. & B2B Integration

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Engineering Lifecylce Management', 8),
('Maximo',8),
('Order Management System (OMS)', 8),
('Sterling', 8),
('Sterling, ELM', 8),
('Tririga', 8);


-- Business Analytics

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Cognos', 9),
('Planning Analytics', 9);


-- Content Management

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('CMOD', 10),
('Filenet Content Manager', 10);


-- Data Integration

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('DataStage', 11),
('StreamSets', 11);


-- Data Intelligence

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Cloud Pak for Data', 12),
('Data Lineage', 12),
('Knowledge Catalog', 12),
('Master Data Management', 12);


-- Data Intelligence2

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Cloud Pak for Data', 13),
('Data Replication', 13),
('MDM', 13);


-- Data Lakehouse

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('watsonx.data', 14);


-- Data Security

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Gaurdium', 15);


-- DataBases

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Database Ecosystem', 16),
('DB2', 16),
('DB2 , OCP', 16),
('Netezza', 16),
('Oracle', 16);


-- IBM Cloud

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('IBM Cloud - ROKS/IKS', 17),
('IBM Cloud - VMWare', 17),
('IBM Virtual Private Cloud / Classic', 17);


-- IBM Storage

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Spectrum Symphony', 18);


-- Indentity & Access Mgmt.

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Verify', 19),
('Verify, Guardium', 19);


-- Network Mgmt.

INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Hybrid Cloud Mesh', 20),
('SevOne', 20);


-- Observability
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Cloud Pak for AIOps', 21),
('Instana', 21),
('Operations Insights', 21),
('Turbonomic', 21);

-- Power
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('AIX', 22),
('IBM i', 22);

-- Security
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Qradar', 23);

-- Workflow Automation
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('BAMOE', 24),
('Business Automation Workflow', 24),
('Cloud Pak for Bus. Automation', 24),
('ODM', 24);

-- zAIOps
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('Intellimagic', 25),
('System Automation', 25);

-- zDevOps
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('ABO', 26),
('Additional Products', 26),
('Ansible', 26),
('IDzEE', 26),
('WCA4Z', 26);

-- zHW
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('CICS', 27),
('DB2', 27),
('MQ for z/OS', 27),
('z/OS Core', 27),
('zPCA', 27),
('zStorage', 27);

-- zHybrid Cloud
INSERT INTO practice_product_technology (product_name, practice_area_id) VALUES
('watsonx Code Assistant for z', 28),
('Z Compilers', 28),
('Z Security', 28);



-- Insert values for user_skill



-- Name1 - Power > AIX
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'SANDEEP.P2@ibm.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'Power'),
  (SELECT id FROM practice_area WHERE name = 'Power'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'AIX'),
  '1-3', 'L2', 'level 2'
);

-- Name2 - zHybrid Cloud > watsonx Code Assistant for z
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'DEEPIKA.S.U@ibm.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'zHybrid Cloud'),
  (SELECT id FROM practice_area WHERE name = 'zHybrid Cloud'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'watsonx Code Assistant for z'),
  '0', 'L2', 'level 0'
);

-- Name3 - zHybrid Cloud > Intellimagic
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'RESHMI_PANDA@ibm.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'zHybrid Cloud'),
  (SELECT id FROM practice_area WHERE name = 'zHybrid Cloud'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'Intellimagic'),
  '4-5', 'L3', 'level 3'
);

-- Name4 - zHybrid Cloud > watsonx Code Assistant for z
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'NIRAJAN_K@ibm.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'zHybrid Cloud'),
  (SELECT id FROM practice_area WHERE name = 'zHybrid Cloud'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'watsonx Code Assistant for z'),
  '4-5', 'L2', 'level 3'
);

-- Name5 - AI Tools > watsonx.ai
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'Kausal.SD@ibm.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'AI Tools'),
  (SELECT id FROM practice_area WHERE name = 'AI Tools'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'watsonx.ai'),
  '1-3', 'L2', 'level 2'
);

-- Name6 - Workflow Automation > Cloud Pak for Bus. Automation
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'Name6@somedummydata.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'Workflow Automation'),
  (SELECT id FROM practice_area WHERE name = 'Workflow Automation'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'Cloud Pak for Bus. Automation'),
  '1-3', 'L3', 'level 2'
);

-- Name7 - Identity & Access Mgmt. > Verify
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'Name7@somedummydata.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'Indentity & Access Mgmt.'),
  (SELECT id FROM practice_area WHERE name = 'Indentity & Access Mgmt.'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'Verify'),
  '1-3', 'L2', 'level 2'
);

-- Name8 - Application Integration > Cloud Pak for Integration
INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id,
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'Name8@somedummydata.com'),
  (SELECT practice_id FROM practice_area WHERE name = 'Application Integration'),
  (SELECT id FROM practice_area WHERE name = 'Application Integration'),
  (SELECT id FROM practice_product_technology WHERE product_name = 'Cloud Pak for Integration'),
  '1-3', 'L3', 'level 2'
);

INSERT INTO user_skill (
  user_id, practice_id, practice_area_id, practice_product_technology_id, 
  projects_done, self_assessment_level, professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'Name9@somedummydata.com' LIMIT 1),
  (SELECT practice_id FROM practice_area WHERE name = 'Asset Lifecycle. Mgtm.' LIMIT 1),
  (SELECT id FROM practice_area WHERE name = 'Asset Lifecycle. Mgtm.' LIMIT 1),
  (SELECT id FROM practice_product_technology WHERE product_name = 'Maximo' LIMIT 1),
  '0', 'L3', 'level 1'
);



INSERT INTO user_skill (
  user_id,
  practice_id,
  practice_area_id,
  practice_product_technology_id,
  projects_done,
  self_assessment_level,
  professional_level
) VALUES (
  (SELECT id FROM users WHERE email = 'PawanKumar@ibm.com' LIMIT 1),
  (SELECT practice_id FROM practice_area WHERE name = 'Application Integration' LIMIT 1),
  (SELECT id FROM practice_area WHERE name = 'Application Integration' LIMIT 1),
  (SELECT id FROM practice_product_technology WHERE product_name = 'Cloud Pak for Integration' LIMIT 1),
  '1-3',
  'L3',
  'level 2'
);
