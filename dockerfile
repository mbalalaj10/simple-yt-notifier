# Simple Youtube Notifier - Dockerfile for building the application image and running it in a container.
# Created on April 9th, 2026

# Load and use official node.js image as the base image for the notifier.
FROM node:24-alpine@sha256:8c9b1e5a1c3e4f2b6d8e7a9c3f4e5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j

# Setting the app directory
WORKDIR /usr/src/app

# Dependency installation
COPY package*.json ./
RUN npm install --production

# Copying the source code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]