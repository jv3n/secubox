# Railway Deployment Guide

## Services Configuration

This project requires **3 services** on Railway:

### 1. MongoDB (Database)
### 2. Backend API (Spring Boot)
### 3. Frontend (Angular)

---

## Step 1: Create a New Railway Project

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create a new project: **"New Project"** → **"Deploy from GitHub repo"**
4. Select the `secubox` repository

---

## Step 2: Add MongoDB

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MongoDB"**
3. Railway will automatically create a MongoDB instance
4. Note the `MONGO_URL` variable that will be auto-generated

---

## Step 3: Deploy the Backend

### Service Configuration

1. Click **"+ New"** → **"GitHub Repo"** → Select `secubox`
2. Name the service: `secubox-api`

### Root Directory
- **Settings** → **Root Directory**: `projects/backend/secubox-api`

### Environment Variables

Add the following variables in **Variables**:

```bash
# MongoDB Connection (references the MongoDB service)
SPRING_DATA_MONGODB_URI=${{MongoDB.MONGO_URL}}

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# CORS (Frontend Railway URL - update after frontend deployment)
ALLOWED_ORIGINS=https://secubox-web-production.up.railway.app

# File Storage
FILE_STORAGE_PATH=/app/storage
```

### Dockerfile
The backend will automatically use the `projects/backend/secubox-api/Dockerfile` file

### Healthcheck
Railway will automatically detect port 8080

---

## Step 4: Deploy the Frontend

### Service Configuration

1. Click **"+ New"** → **"GitHub Repo"** → Select `secubox` (again)
2. Name the service: `secubox-web`

### Root Directory
- **Settings** → **Root Directory**: `projects/frontend/secubox-web`

### Environment Variables

Add the following variables in **Variables**:

```bash
# Backend API URL (references the backend service)
API_URL=${{secubox-api.RAILWAY_PUBLIC_DOMAIN}}

# Node environment
NODE_ENV=production
```

### Build Configuration

The frontend will automatically use the `projects/frontend/secubox-web/Dockerfile` file

---

## Step 5: Angular Configuration for Railway

The frontend needs to know the backend API URL. You have 2 options:

### Option A: Build-time Environment Variable (Recommended)

Modify `projects/frontend/secubox-web/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://secubox-api-production.up.railway.app/api'
};
```

### Option B: Dynamic Configuration (Runtime)

Create an `assets/config.json` file that will be loaded at app startup.

---

## Step 6: Generate Public Domains

1. For the **backend**: **Settings** → **Networking** → **Generate Domain**
2. For the **frontend**: **Settings** → **Networking** → **Generate Domain**

You will get URLs like:
- Backend: `https://secubox-api-production.up.railway.app`
- Frontend: `https://secubox-web-production.up.railway.app`

---

## Step 7: Update CORS

Once the frontend is deployed, update the backend's `ALLOWED_ORIGINS` variable with the actual frontend URL:

```bash
ALLOWED_ORIGINS=https://secubox-web-production.up.railway.app
```

---

## Final Services Structure

```
Railway Project: secubox
├── MongoDB (Database)
│   └── MONGO_URL (auto-generated)
│
├── secubox-api (Backend)
│   ├── Root: projects/backend/secubox-api
│   ├── Port: 8080
│   └── Variables:
│       ├── SPRING_DATA_MONGODB_URI=${{MongoDB.MONGO_URL}}
│       ├── SERVER_PORT=8080
│       ├── SPRING_PROFILES_ACTIVE=prod
│       ├── ALLOWED_ORIGINS=https://...railway.app
│       └── FILE_STORAGE_PATH=/app/storage
│
└── secubox-web (Frontend)
    ├── Root: projects/frontend/secubox-web
    ├── Port: 8080 (nginx)
    └── Variables:
        ├── API_URL=${{secubox-api.RAILWAY_PUBLIC_DOMAIN}}
        └── NODE_ENV=production
```

---

## Useful Commands

### View Logs
```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# View real-time logs
railway logs
```

### Manual Redeployment
From the Railway interface → Service → **"Deploy"** → **"Redeploy"**

---

## Estimated Costs

With occasional usage (demos):
- **MongoDB**: ~$1-2/month
- **Backend**: ~$2-3/month
- **Frontend**: ~$1/month

**Total**: ~$4-6/month (within the $5 free tier + small overage possible)

💡 **Tip**: Delete services between demos to save costs:
- Service → **Settings** → **Remove Service from All Environments**

---

## Troubleshooting

### Backend won't start
- Check logs: MongoDB connection error?
- Verify that `SPRING_DATA_MONGODB_URI` is properly defined

### Frontend shows CORS error
- Verify that `ALLOWED_ORIGINS` in the backend contains the exact frontend URL
- Redeploy the backend after modification

### "Out of memory" on backend
- Reduce `MaxRAMPercentage` in the Dockerfile (currently 75%)
- Or upgrade to a paid plan with more RAM

### Build fails
- Verify the **Root Directory** of each service
- Frontend: `projects/frontend/secubox-web`
- Backend: `projects/backend/secubox-api`

---

## Reference URLs

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app
- **Pricing**: https://railway.app/pricing
