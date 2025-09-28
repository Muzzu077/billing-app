# 🚀 Vercel Deployment Guide for Billing App

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **MongoDB Atlas** - For cloud database (free tier available)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/billing-app.git
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user:
   - Database Access → Add New Database User
   - Username: `billing-app-user`
   - Password: Generate a secure password
4. Whitelist all IP addresses:
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Get your connection string:
   - Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password

## Step 3: Deploy to Vercel

1. **Import Project:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Framework Preset: **Other**
   - Root Directory: **/** (leave empty)
   - Build Command: `npm run vercel-build`
   - Output Directory: `frontend/dist`

3. **Set Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://billing-app-user:yourpassword@cluster0.xxxxx.mongodb.net/billing-app?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

## Step 4: Verify Deployment

1. **Check API Health:**
   - Visit: `https://your-app-name.vercel.app/api/health`
   - Should return: `{"status":"OK","message":"Billing App API is running"}`

2. **Test Frontend:**
   - Visit: `https://your-app-name.vercel.app`
   - Should load the billing app interface

## Step 5: Post-Deployment Setup

1. **Seed Initial Data:**
   Since Vercel functions are stateless, you'll need to seed data through the API or create an admin panel.

2. **Create Admin User:**
   You can create an admin user through the registration endpoint or add a seed endpoint.

## Configuration Details

### What's Been Set Up:

✅ **vercel.json** - Vercel configuration file
✅ **api/index.js** - Serverless function entry point  
✅ **Routing** - API routes configured for `/api/*`
✅ **Frontend Build** - Optimized for Vercel static hosting
✅ **Environment** - Production environment variables

### File Structure for Vercel:
```
billing-app/
├── api/
│   ├── index.js          # Serverless function entry
│   └── package.json      # API dependencies
├── frontend/
│   ├── dist/            # Built frontend (auto-generated)
│   └── ...
├── backend/
│   ├── models/          # Shared with API
│   ├── routes/          # Shared with API
│   └── ...
├── vercel.json          # Deployment configuration
└── .vercelignore        # Files to ignore during deployment
```

## Troubleshooting

### Common Issues:

1. **API Not Working:**
   - Check environment variables are set correctly
   - Verify MongoDB connection string
   - Check function logs in Vercel dashboard

2. **Build Failures:**
   - Ensure all dependencies are in package.json
   - Check build logs in Vercel dashboard
   - Verify build command is correct

3. **CORS Errors:**
   - Environment variable `FRONTEND_URL` should match your Vercel domain
   - Check API CORS configuration

4. **File Upload Issues:**
   - Vercel has limitations on file uploads
   - Consider using external storage (AWS S3, Cloudinary) for logos

### Debugging:

1. **Check Vercel Logs:**
   - Go to Vercel dashboard → Your project → Functions tab
   - View logs for API calls

2. **Test API Endpoints:**
   ```bash
   curl https://your-app-name.vercel.app/api/health
   curl https://your-app-name.vercel.app/api/brands
   ```

## Limitations & Considerations

1. **File Uploads:** Vercel functions have limited file storage. Consider external storage for brand logos.
2. **Function Timeout:** 10-second limit on serverless functions.
3. **Cold Starts:** First API call might be slower due to cold start.
4. **Database:** Use MongoDB Atlas for persistent storage.

## Custom Domain (Optional)

1. In Vercel dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

## Automatic Deployments

- Every push to your main branch will trigger a new deployment
- Preview deployments for pull requests
- Rollback capability from Vercel dashboard

## Monitoring

- Vercel provides built-in analytics
- Monitor function performance and errors
- Set up alerts for downtime

Your billing app is now ready for Vercel deployment! 🎉