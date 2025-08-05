# IBM Skills Pro Application

A full-stack application for managing professional skills, certifications, and career development within IBM.

## 🏗️ Architecture

- **Frontend**: React with Vite, TypeScript, Tailwind CSS, Carbon Design System
- **Backend**: Node.js with Express.js REST API
- **Database**: MySQL (with mock database fallback for development)
- **Authentication**: JWT tokens with IBM AppID integration

## 🚀 Quick Start

### Option 1: Start Backend API Only

```bash
# Start the backend API server
./start-api.sh
```

The API will be available at `http://localhost:8082`

### Option 2: Full Application Setup

1. **Start Backend (Terminal 1)**:
```bash
cd backend
npm install
npm start
```

2. **Start Frontend (Terminal 2)**:
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## 📂 Project Structure

```
├── backend/                 # Express.js API server
│   ├── routes/             # API route handlers
│   ├── config/             # Database and app configuration
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── schema.sql             # Database schema
├── insert_script.sql      # Sample data
└── start-api.sh          # Quick start script
```

## 🔌 API Endpoints

### Core Endpoints
- `GET /api/practices` - Get all practices
- `GET /api/practice-areas/practice/:id` - Get practice areas by practice
- `GET /api/user` - Get current user info
- `GET /api/profile/:email` - Get user profile
- `PUT /api/profile/:email` - Update user profile

### Skills Management
- `GET /api/user-skills/user/:userId` - Get user skills
- `POST /api/user-skills` - Add new skill
- `PUT /api/user-skills/:id` - Update skill
- `DELETE /api/user-skills/:id` - Delete skill

### Certifications & Assets
- `GET /api/professional-certifications/user/:userId` - Get certifications
- `POST /api/professional-certifications` - Add certification
- `GET /api/high-impact-assets/user/:userId` - Get high impact assets
- `POST /api/high-impact-assets` - Add high impact asset

### System
- `GET /health` - Health check
- `GET /oauth2/authorization/appid` - OAuth login

## 🗄️ Database Setup

### MySQL Setup (Production)
1. Install MySQL and create database:
```sql
CREATE DATABASE skills_pro_db;
```

2. Update `.env` file in backend directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skills_pro_db
DB_USER=your_username
DB_PASSWORD=your_password
```

3. Import schema:
```bash
mysql -u your_username -p skills_pro_db < schema.sql
mysql -u your_username -p skills_pro_db < insert_script.sql
```

### Mock Database (Development)
The application automatically uses a mock database if MySQL is not available. This includes sample data for:
- 5 practice areas (Software Development, Data Science, etc.)
- Multiple practice areas per practice
- Sample user data and skills
- Mock certifications and assets

## 🔧 Configuration

### Backend Configuration (.env)
```env
PORT=8082
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skills_pro_db
DB_USER=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration
The frontend is configured to proxy API requests to the backend through Vite configuration in `frontend/vite.config.js`.

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:8082/health

# Test practices endpoint
curl http://localhost:8082/api/practices

# Test user endpoint
curl http://localhost:8082/api/user
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "skills-pro-api"
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to web server
```

## 🔐 Security

- JWT tokens for authentication
- CORS enabled for cross-origin requests
- Helmet.js for security headers
- Input validation with express-validator
- Password hashing with bcryptjs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📝 License

Apache 2.0 License

## 🆘 Troubleshooting

### API Not Working
1. Ensure backend server is running on port 8082
2. Check if port is available: `lsof -i :8082`
3. Verify environment variables are set correctly
4. Check server logs for database connection issues

### Database Connection Issues
1. Verify MySQL is running and accessible
2. Check database credentials in `.env`
3. The app will automatically fall back to mock database if MySQL is unavailable

### Frontend Issues
1. Ensure frontend dev server is running on port 5173
2. Check if API calls are being proxied correctly
3. Verify CORS configuration allows frontend origin

## ✅ Status

- ✅ Backend API server running on port 8082
- ✅ All major API endpoints implemented
- ✅ Mock database with sample data
- ✅ CORS configured for frontend integration
- ✅ Authentication system ready
- ✅ Health check endpoint available

Your API is now working and ready for frontend integration!