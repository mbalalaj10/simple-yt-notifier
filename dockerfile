# Simple Youtube Notifier - Dockerfile for building the application image and running it in a container.
# Created on April 9th, 2026

# Load and use official node.js image as the base image for the notifier.
FROM node:24-alpine@sha256:5bc53106902596d90fb497746b74ea40e0625c1c8327681d6bff3ee6ad42a22b

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