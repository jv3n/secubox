# Secubox

Secure document management platform for enterprises, similar to Dropbox or MyPrimoBox, with HR software integration.

## Tech Stack

- **Frontend**: Angular 21
- **Backend**: Spring Boot 3.4 + Kotlin + Coroutines
- **Database**: MongoDB (Reactive)
- **Local Development**: Tilt + Docker

## Project Structure

```
secubox/
├── Tiltfile                    # Tilt orchestration
├── docker-compose.yml          # MongoDB
├── projects/
│   ├── frontend/
│   │   └── secubox-web/        # Angular application
│   └── backend/
│       └── secubox-api/        # Spring Boot Kotlin API
└── README.md
```

## Quick Start

### Using Tilt (Recommended)

```bash
# Install Tilt (if not already installed)
brew install tilt-dev/tap/tilt

# Start all services (MongoDB, Backend, Frontend)
tilt up
```

**Access:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- MongoDB: localhost:27017
- Tilt Dashboard: http://localhost:10350

### Manual Setup

#### Frontend

```bash
cd projects/frontend/secubox-web
npm install
ng serve
```

#### Backend

```bash
cd projects/backend/secubox-api
./gradlew bootRun
```

**Note**: You'll need MongoDB running locally on port 27017.

## Features

### Frontend
- File system with navigation
- Document preview (PDF, images, etc.)
- Material Design UI
- Collapsible navigation sidebar
- Resizable preview panel

### Backend
- Reactive API with Kotlin Coroutines
- File deduplication using SHA-256 hashing
- MongoDB for file tree storage
- File metadata management
- RESTful endpoints for file operations

## Development

Tilt provides live reloading for both frontend and backend:
- Changes to Angular source files trigger automatic rebuild
- Changes to Kotlin source files trigger automatic recompilation
- All services logs are centralized in Tilt UI
