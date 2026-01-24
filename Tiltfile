# Secubox Tiltfile - Local Development Environment

# MongoDB - Kubernetes
k8s_yaml(blob("""
apiVersion: v1
kind: Service
metadata:
  name: mongodb
spec:
  ports:
    - port: 27017
      targetPort: 27017
  selector:
    app: mongodb
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongodb
          image: mongo:8.0
          ports:
            - containerPort: 27017
          env:
            - name: MONGO_INITDB_DATABASE
              value: secubox
"""))

k8s_resource(
    'mongodb',
    port_forwards='27017:27017',
    labels=['database']
)

# Backend - Spring Boot Kotlin
docker_build(
    'secubox-api',
    context='./projects/backend/secubox-api',
    dockerfile='./projects/backend/secubox-api/Dockerfile',
    live_update=[
        sync('./projects/backend/secubox-api/src', '/app/src'),
        run('cd /app && ./gradlew build -x test', trigger=['./projects/backend/secubox-api/src']),
    ]
)

k8s_yaml(blob("""
apiVersion: v1
kind: Service
metadata:
  name: secubox-api
spec:
  ports:
    - port: 8080
      targetPort: 8080
  selector:
    app: secubox-api
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secubox-api
spec:
  selector:
    matchLabels:
      app: secubox-api
  template:
    metadata:
      labels:
        app: secubox-api
    spec:
      containers:
        - name: secubox-api
          image: secubox-api
          ports:
            - containerPort: 8080
          env:
            - name: SPRING_DATA_MONGODB_URI
              value: mongodb://mongodb:27017/secubox
"""))

k8s_resource(
    'secubox-api',
    port_forwards='8080:8080',
    labels=['backend']
)

# Frontend - Angular
docker_build(
    'secubox-web',
    context='./projects/frontend/secubox-web',
    dockerfile='./projects/frontend/secubox-web/Dockerfile',
    live_update=[
        sync('./projects/frontend/secubox-web/src', '/app/src'),
        run('cd /app && npm run build', trigger=['./projects/frontend/secubox-web/src']),
    ]
)

k8s_yaml(blob("""
apiVersion: v1
kind: Service
metadata:
  name: secubox-web
spec:
  ports:
    - port: 4200
      targetPort: 4200
  selector:
    app: secubox-web
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secubox-web
spec:
  selector:
    matchLabels:
      app: secubox-web
  template:
    metadata:
      labels:
        app: secubox-web
    spec:
      containers:
        - name: secubox-web
          image: secubox-web
          ports:
            - containerPort: 4200
"""))

k8s_resource(
    'secubox-web',
    port_forwards='4200:4200',
    labels=['frontend']
)

