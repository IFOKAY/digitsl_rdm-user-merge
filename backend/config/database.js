const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'skills_pro_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Initialize with mock database by default
const mockDb = require('./mockDatabase');
let pool = mockDb.pool;
let useMockDatabase = true;

// Test database connection and fallback to mock if needed
const testConnection = async () => {
  try {
    const testPool = mysql.createPool(dbConfig);
    const connection = await testPool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
    pool = testPool;
    useMockDatabase = false;
    return true;
  } catch (error) {
    console.warn('⚠️ MySQL connection failed, using mock database:', error.message);
    console.log('📝 To use MySQL, ensure it\'s running and update your .env file');
    
    // Keep using mock database
    pool = mockDb.pool;
    useMockDatabase = true;
    await mockDb.testConnection();
    return true;
  }
};

// Initialize database connection in background
testConnection();

module.exports = {
  get pool() {
    return pool;
  },
  testConnection,
  get isUsingMockDatabase() {
    return useMockDatabase;
  }
};