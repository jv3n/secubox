# Multi-stage Dockerfile for Spring Boot Kotlin

# Stage 1: Build
FROM gradle:8.11-jdk21 AS build

WORKDIR /app

# Copy gradle files
COPY build.gradle.kts settings.gradle.kts gradle.properties ./

# Download dependencies (cache layer)
RUN gradle dependencies --no-daemon || true

# Copy source code
COPY src ./src

# Build application
RUN gradle build -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Create storage directory
RUN mkdir -p /app/storage

# Expose port
EXPOSE 8080

# Run application with optimized settings for Railway
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
