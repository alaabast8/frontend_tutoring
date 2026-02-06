# Stage 1: Build the React app
FROM node:18-alpine AS builder

# Accept the backend URL as a build argument
ARG VITE_BACKEND_URL
# Set it as an environment variable so Vite can see it during build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/config.template

# Railway uses the PORT variable at runtime
ENV PORT=80

# Use a shell command to swap the PORT variable into the Nginx config and start
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/config.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]