# Multi-stage Dockerfile for Angular Production

# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Angular app for production
RUN npm run build -- --configuration production

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/dist/secubox-web/browser /usr/share/nginx/html

# Expose port (Railway will use PORT env variable)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
