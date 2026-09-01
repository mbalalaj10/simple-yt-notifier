# Simple Youtube Notifier - Dockerfile for building the application image and running it in a container.
# Created on April 9th, 2026

# Load and use official node.js image as the base image for the notifier.
FROM node:26-alpine@sha256:e71ac5e964b9201072425d59d2e876359efa25dc96bb1768cb73295728d6e4ea

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