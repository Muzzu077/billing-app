# Billing App Deployment Guide

This guide provides multiple deployment options for your electrical business quotation generator.

## Pre-deployment Checklist

1. ✅ **Environment Variables Ready**
   - MongoDB connection string
   - JWT secret for authentication
   - Port configuration

2. ✅ **Dependencies Installed**
   ```bash
   npm run install-all
   ```

3. ✅ **Build Test**
   ```bash
   npm run build
   ```

## Deployment Options

### Option 1: Railway (Recommended - Full Stack)

**Steps:**
1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_jwt_secret
   NODE_ENV=production
   ```
4. Deploy automatically with provided `railway.json` config

**Pros:** Free tier, easy setup, handles both frontend and backend

### Option 2: Render (Full Stack)

**Steps:**
1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Use the provided `render.yaml` configuration
4. Set environment variables in Render dashboard
5. Deploy

**Pros:** Free tier, good performance, easy setup

### Option 3: Docker Deployment

**Local Docker:**
```bash
docker build -t billing-app .
docker run -p 5000:5000 \
  -e MONGODB_URI=your_connection_string \
  -e JWT_SECRET=your_secret \
  billing-app
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/billing-app
      - JWT_SECRET=your_secret
      - NODE_ENV=production
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Option 4: Separate Frontend/Backend Deployment

**Frontend (Netlify/Vercel):**
1. Deploy frontend folder to Netlify
2. Update `frontend/.env` with backend URL
3. Use provided `netlify.toml` config

**Backend (Railway/Render/Heroku):**
1. Deploy only the backend folder
2. Set environment variables
3. Update frontend API URL

### Option 5: Local Production

**Start production server:**
```bash
# Set environment to production
cd backend
set NODE_ENV=production  # Windows
export NODE_ENV=production  # Linux/Mac

# Start the server
npm start
```

**Access:** http://localhost:5000

## Database Setup

### MongoDB Atlas (Recommended for cloud deployment)

1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update MONGODB_URI in your deployment platform

### Local MongoDB
```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# Mac: brew install mongodb/brew/mongodb-community
# Linux: Follow MongoDB installation guide

# Start MongoDB
mongod

# Connection string: mongodb://localhost:27017/billing-app
```

## Environment Variables

**Required for all deployments:**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_minimum_32_characters
NODE_ENV=production
PORT=5000
```

**Frontend environment (for separate deployment):**
```env
VITE_API_URL=https://your-backend-url.com
```

## Testing Deployment

1. **Health Check:** Visit your deployed URL
2. **API Test:** Check `/api/brands` endpoint
3. **Database:** Verify MongoDB connection
4. **Authentication:** Test login functionality
5. **File Upload:** Test brand logo upload

## Troubleshooting

**Common Issues:**

1. **CORS Errors:** Ensure backend CORS is configured for your frontend domain
2. **MongoDB Connection:** Check connection string and network access
3. **Build Failures:** Ensure all dependencies are installed
4. **Static Files:** Verify uploads directory exists and is writable
5. **Environment Variables:** Double-check all required variables are set

**Logs to Check:**
- Application logs for errors
- Database connection logs
- Network/CORS errors in browser console

## Post-Deployment Setup

1. **Seed Data:** Run the seed script to populate initial data
2. **Admin Account:** Use reset-admin script to create admin user
3. **Brand Logos:** Upload brand logos through the admin panel
4. **Test Quotations:** Create test quotations to verify functionality

## Security Considerations

1. **Environment Variables:** Never commit `.env` files to git
2. **JWT Secret:** Use a strong, random secret (32+ characters)
3. **MongoDB:** Restrict IP access and use strong credentials
4. **HTTPS:** Ensure your deployment platform uses HTTPS
5. **File Uploads:** Validate file types and sizes

## Monitoring

- Set up application monitoring (logging, error tracking)
- Monitor database performance and usage
- Set up alerts for downtime or errors
- Regular backups of MongoDB data

Choose the deployment option that best fits your needs:
- **Railway/Render:** Best for beginners, free tier available
- **Docker:** Best for custom deployments or self-hosting
- **Separate deployment:** Best if you want different platforms for frontend/backend