# Aura - Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Create Local Environment File
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Groq API key
GROQ_API_KEY=your_actual_groq_api_key
CORS_ORIGINS=http://localhost:3000
```

### 2. Create Frontend Environment File
```bash
# In the root directory, create .env
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

## 🚂 Railway Deployment (Backend)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python and use `railway.toml`

### Step 3: Add Environment Variables in Railway
Go to your project → Variables tab and add:
```
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGINS=https://your-app.vercel.app
PORT=8000
```

### Step 4: Get Railway URL
- Copy your Railway app URL (e.g., `https://your-app.railway.app`)
- You'll need this for Vercel

## ▲ Vercel Deployment (Frontend)

### Step 1: Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project" → Import your GitHub repository
3. Framework Preset: **Create React App**
4. Root Directory: `./` (keep default)
5. Build Command: `npm run build`
6. Output Directory: `build`

### Step 2: Add Environment Variable in Vercel
Go to Project Settings → Environment Variables:
```
REACT_APP_API_URL=https://your-app.railway.app
```

### Step 3: Update Railway CORS
Go back to Railway → Variables and update:
```
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

### Step 4: Redeploy
- Railway: Will auto-redeploy on CORS change
- Vercel: Trigger a new deployment

## 🧪 Testing Deployment

### Test Backend (Railway)
```bash
curl https://your-app.railway.app/
# Should return: {"message": "Aura - Autonomous Treasury Analyst API is running"}
```

### Test Frontend (Vercel)
1. Visit `https://your-app.vercel.app`
2. Try logging in with test credentials
3. Upload a sample Excel file from `datasets/` folder
4. Check browser console for any CORS errors

## 🔧 Troubleshooting

### CORS Errors
- Make sure Railway has correct `CORS_ORIGINS` with your Vercel URL
- Railway needs to restart after environment variable changes

### Backend Not Responding
- Check Railway logs for errors
- Verify `GROQ_API_KEY` is set correctly
- Check that port is set to `$PORT` (Railway provides this)

### Frontend Can't Connect
- Verify `REACT_APP_API_URL` in Vercel points to Railway URL
- Redeploy Vercel after adding environment variable
- Check browser Network tab for failed requests

### Database Issues
- Railway restarts may clear `users_db.json`
- Consider using Railway's volume storage or a proper database
- For production, migrate to PostgreSQL or MongoDB

## 📁 Important Files

- `.gitignore` - Prevents committing sensitive files
- `.env.example` - Template for environment variables
- `Procfile` - Railway/Heroku deployment config
- `railway.toml` - Railway-specific configuration
- `requirements.txt` - Python dependencies (includes python-dotenv)

## 🎯 Post-Deployment

1. **Update README.md** with your live URLs
2. **Set up custom domain** (optional)
   - Vercel: Project Settings → Domains
   - Railway: Project Settings → Domains
3. **Enable HTTPS** (automatic on both platforms)
4. **Monitor logs** for any issues
5. **Set up proper database** for production use

## 🔐 Security Notes

- Never commit `.env` files
- Keep API keys secure in platform environment variables
- Use proper database with authentication in production
- Enable rate limiting for API endpoints
- Review CORS origins regularly

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/

---

**Note**: Both Railway and Vercel offer free tiers perfect for testing and small projects. Monitor your usage to stay within limits.
