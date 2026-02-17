# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Build-time argument for API URL
ARG VITE_API_URL

# Set as environment variable for Vite build
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - serve static files with a simple HTTP server
FROM node:18-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve@14.2.3

# Copy built app
COPY --from=build /app/dist ./dist

# Expose port 80
EXPOSE 80

# Serve the built app on port 80
CMD ["serve", "-s", "dist", "-l", "80"]
