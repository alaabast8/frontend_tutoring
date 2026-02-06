# Stage 1: Build the React app
FROM node:18-alpine AS builder

# These MUST match the variable name in Railway
ARG VITE_BACKEND_URL
# This makes the variable available to the 'npm run build' process
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
# When this runs, Vite will now find VITE_BACKEND_URL
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/config.template

# Railway uses the PORT variable at runtime
ENV PORT=8080

# Use shell to swap the PORT variable into the Nginx config
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/config.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]