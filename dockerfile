# Simple Youtube Notifier - Dockerfile for building the application image and running it in a container.
# Created on April 9th, 2026

# Load and use official node.js image as the base image for the notifier.
FROM node:24-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b

# Setting the app directory
WORKDIR /usr/src/app

# Dependency installation
COPY package*.json ./
RUN npm ci --only=production

# Copying the source code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]