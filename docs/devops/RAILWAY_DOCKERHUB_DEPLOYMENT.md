# Railway Deployment - Docker Hub

Deploy Secubox on Railway using pre-built Docker images published on Docker Hub.

## Architecture

```
GitHub Actions (CI/CD)
    ↓ Build & Push
Docker Hub (hub.docker.com/u/j6455lienv)
    ↓ Pull Images
Railway (Deployment)
```

---

## Step 1: Docker Hub Configuration

### 1.1 Create a Docker Hub Access Token

1. Go to https://hub.docker.com/settings/security
2. Click **"New Access Token"**
3. Name: `github-actions`
4. Permissions: **Read, Write, Delete**
5. **Copy the token** (you won't see it again!)

### 1.2 Add the Token to GitHub Secrets

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `DOCKERHUB_TOKEN`
4. Value: Paste the Docker Hub token copied in the previous step
5. Click **"Add secret"**

---

## Step 2: Trigger the Image Build

### Push to GitHub

```bash
git add .
git commit -m "feat: railway docker hub deployment"
git push origin main
```

GitHub Actions will automatically:
1. Build the backend and frontend images
2. Push them to Docker Hub:
   - `j6455lienv/secubox-backend:latest`
   - `j6455lienv/secubox-frontend:latest`

### Verify the Workflow

1. Go to GitHub → **Actions**
2. Verify that the **"Build and Push Docker Images"** workflow is running
3. Wait for it to complete ✅ (approximately 5-10 minutes)

### Verify on Docker Hub

Once the workflow is complete, your images are available at:
- https://hub.docker.com/r/j6455lienv/secubox-backend
- https://hub.docker.com/r/j6455lienv/secubox-frontend

---

## Step 3: Deploy on Railway

### 3.1 Create a New Project

1. Go to [railway.app](https://railway.app)
2. **New Project** → **Empty Project**
3. Name it: `secubox`

### 3.2 Add MongoDB

1. **+ New** → **Database** → **Add MongoDB**
2. Railway will automatically create the instance
3. The `MONGO_URL` variable will be auto-generated

### 3.3 Deploy the Backend (Docker Image)

1. **+ New** → **Docker Image**
2. **Image URL**: `j6455lienv/secubox-backend:latest`
3. Name the service: `backend`

#### Environment Variables

In **Variables**, add:

```bash
# MongoDB
SPRING_DATA_MONGODB_URI=${{MongoDB.MONGO_URL}}

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# CORS (update after frontend deployment)
ALLOWED_ORIGINS=https://frontend-production.up.railway.app

# Storage
FILE_STORAGE_PATH=/app/storage
```

#### Networking

- **Settings** → **Networking** → **Generate Domain**
- Note the backend URL (example: `https://backend-production-xxxx.up.railway.app`)

### 3.4 Deploy the Frontend (Docker Image)

1. **+ New** → **Docker Image**
2. **Image URL**: `j6455lienv/secubox-frontend:latest`
3. Name the service: `frontend`

#### Environment Variables

```bash
# Backend API
API_URL=https://backend-production-xxxx.up.railway.app

# Environment
NODE_ENV=production
```

> ⚠️ Replace `backend-production-xxxx.up.railway.app` with your actual backend URL

#### Networking

- **Settings** → **Networking** → **Generate Domain**
- Note the frontend URL

### 3.5 Update CORS

Return to the **backend** variables and update `ALLOWED_ORIGINS` with the actual frontend URL:

```bash
ALLOWED_ORIGINS=https://frontend-production-xxxx.up.railway.app
```

Railway will automatically redeploy the service.

---

## Step 4: Access the Application

- **Frontend**: `https://frontend-production-xxxx.up.railway.app`
- **Backend API**: `https://backend-production-xxxx.up.railway.app/api`

---

## Update Workflow

### Update Code and Redeploy

1. **Modify code** locally
2. **Commit & Push** to `main`
   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```
3. **GitHub Actions** automatically builds new images and pushes them to Docker Hub
4. **Railway**: Redeploy manually
   - Go to each service (backend/frontend)
   - Click **"Redeploy"**

### Auto-redeploy (Optional)

Railway can automatically redeploy when a new image is available:

1. In Railway, **backend** service:
   - **Settings** → **Deploy** → **Deploy on image update** → Enable
2. Repeat for **frontend**

---

## Final Railway Structure

```
Railway Project: secubox
├── MongoDB
│   └── MONGO_URL (auto)
│
├── backend (Docker Image)
│   ├── Image: j6455lienv/secubox-backend:latest
│   ├── Port: 8080
│   └── Variables:
│       ├── SPRING_DATA_MONGODB_URI=${{MongoDB.MONGO_URL}}
│       ├── SERVER_PORT=8080
│       ├── SPRING_PROFILES_ACTIVE=prod
│       ├── ALLOWED_ORIGINS=https://frontend-xxx.up.railway.app
│       └── FILE_STORAGE_PATH=/app/storage
│
└── frontend (Docker Image)
    ├── Image: j6455lienv/secubox-frontend:latest
    ├── Port: 8080
    └── Variables:
        ├── API_URL=https://backend-xxx.up.railway.app
        └── NODE_ENV=production
```

---

## URLs to Use in Railway

When Railway asks "Enter a Docker image":

### Backend
```
j6455lienv/secubox-backend:latest
```

### Frontend
```
j6455lienv/secubox-frontend:latest
```

> These images are public, Railway can download them without authentication.

---

## Useful Commands

### Build Images Locally

```bash
# Backend
docker build -t j6455lienv/secubox-backend:latest \
  -f projects/backend/secubox-api/Dockerfile \
  projects/backend/secubox-api

# Frontend
docker build -t j6455lienv/secubox-frontend:latest \
  -f projects/frontend/secubox-web/Dockerfile \
  projects/frontend/secubox-web
```

### Test Locally

```bash
# Pull images from Docker Hub
docker pull j6455lienv/secubox-backend:latest
docker pull j6455lienv/secubox-frontend:latest

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up
```

### Manual Push to Docker Hub

```bash
# Login
docker login -u j6455lienv

# Push
docker push j6455lienv/secubox-backend:latest
docker push j6455lienv/secubox-frontend:latest
```

---

## Cost Management

### Pause Between Demos

1. In Railway, for each service:
   - Click on the service
   - **Settings** → Bottom: **Delete Service** (or pause if available)

2. To restart: Re-create the service with the same image

### Cost Monitoring

- Railway Dashboard → **Usage**
- The $5 free tier covers approximately 50-100h/month

---

## Troubleshooting

### "Failed to pull image"

**Solution**: Verify that the images exist on Docker Hub
- https://hub.docker.com/r/j6455lienv/secubox-backend
- https://hub.docker.com/r/j6455lienv/secubox-frontend

### Frontend cannot reach backend

**Check**:
1. The backend URL is correct in the frontend variables
2. CORS is configured with the correct frontend URL in the backend
3. Both services are running (green in Railway)

### GitHub Actions fails with "denied: requested access to the resource is denied"

**Solution**: Verify that `DOCKERHUB_TOKEN` is properly configured in GitHub Secrets

### Images not updated on Railway

After a push:
1. Verify that GitHub Actions has completed (✅)
2. Check images on Docker Hub (new tag/date)
3. In Railway: Click **"Redeploy"** to force pull

### "Out of memory" on Railway

Reduce RAM in the backend Dockerfile:
```dockerfile
# Change from 75% to 60%
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=60.0", "-jar", "app.jar"]
```

---

## Steps Summary

✅ **1. Create Docker Hub token** (https://hub.docker.com/settings/security)

✅ **2. Add `DOCKERHUB_TOKEN` to GitHub Secrets**

✅ **3. Push code to GitHub** (`git push origin main`)

✅ **4. Wait for GitHub Actions build** (~5-10 min)

✅ **5. Create Railway project**

✅ **6. Add MongoDB on Railway**

✅ **7. Add backend** with image `j6455lienv/secubox-backend:latest`

✅ **8. Add frontend** with image `j6455lienv/secubox-frontend:latest`

✅ **9. Configure environment variables**

✅ **10. Generate public domains**

✅ **11. Test the application** 🎉

---

## Advantages of This Approach

✅ **Public images**: No credentials needed on Railway
✅ **Free builds**: GitHub Actions is free for public repos
✅ **Fast deployment**: Railway pulls the image in ~30 seconds
✅ **Automated CI/CD**: Push → Build → Available on Docker Hub
✅ **Reproducible**: Same image everywhere (local, test, prod)

---

## Resources

- **Docker Hub**: https://hub.docker.com/u/j6455lienv
- **GitHub Actions**: https://github.com/YOUR_USERNAME/secubox/actions
- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app
