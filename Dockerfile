# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
# Using npm ci for faster, more reliable builds in CI/CD environments
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with a lightweight web server
FROM nginx:stable-alpine

# Copy the built static files from the 'builder' stage to nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]