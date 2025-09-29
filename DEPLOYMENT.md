# 🚀 Jal Setu - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables Setup

Make sure to set these in Vercel Dashboard → Settings → Environment Variables:

#### Backend1 (Node.js)

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: `production`
- `FASTAPI_URL`: `https://your-app-name.vercel.app/api/python`
- `AZURE_TRANSLATOR_KEY`: Your Azure Translator key
- `AZURE_TRANSLATOR_REGION`: Your Azure region

#### Backend2 (Python/FastAPI)

- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: `production`

#### Frontend (React/Vite)

- `VITE_API_BASE_URL`: `https://your-app-name.vercel.app/api/node`
- `VITE_PYTHON_API_URL`: `https://your-app-name.vercel.app/api/python`

### 🛠️ Deployment Steps

1. **Connect to Vercel**

   ```bash
   vercel login
   ```

2. **Deploy**

   ```bash
   vercel --prod
   ```

3. **Test Endpoints**
   - Frontend: `https://your-app-name.vercel.app`
   - Backend1 Health: `https://your-app-name.vercel.app/api/node/health`
   - Backend2 Health: `https://your-app-name.vercel.app/api/python/health`

### 🔧 Configuration Files Modified

- ✅ `vercel.json` - Multi-service deployment configuration
- ✅ `backend1/src/index.js` - Added Vercel export and CORS config
- ✅ `backend2/main.py` - Added Mangum handler for serverless
- ✅ `frontend/vite.config.js` - Production build optimization
- ✅ `frontend/src/lib/axios.js` - Environment-based API URLs
- ✅ `.vercelignore` - Optimized ignore patterns

### 🗃️ Database Setup

1. **MongoDB Atlas**
   - Create cluster at https://www.mongodb.com/atlas
   - Add IP `0.0.0.0/0` for Vercel access
   - Update connection string in environment variables

### 🔑 API Keys Required

1. **OpenAI API Key** - For AI recommendations
2. **MongoDB Atlas** - For data persistence
3. **Azure Translator** - For multi-language support (optional)

### 🧪 Testing Deployment

After deployment, test these features:

- [ ] User authentication (login/register)
- [ ] Roof mapping functionality
- [ ] AI recommendation generation
- [ ] Dashboard data display
- [ ] Weather API integration
- [ ] Form submissions

### 🐛 Troubleshooting

**Common Issues:**

- CORS errors → Check backend1 CORS configuration
- API timeouts → Check function timeout settings in vercel.json
- Build failures → Verify all dependencies in package.json
- Environment variables → Double-check variable names and values

**Logs Access:**

```bash
vercel logs your-app-name
```

### 📊 Performance Monitoring

- Use Vercel Analytics for performance insights
- Monitor function execution times
- Set up error tracking for production issues

---

🎉 **Your Jal Setu application is now production-ready for Vercel deployment!**
