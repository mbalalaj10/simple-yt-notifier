# <img src="public/bell.png" align="left" width="48" height="48"> Simple YT Notifier
A simple YouTube to Discord Notifier using Node.js.

[![Docker Image](https://img.shields.io/badge/docker-ghcr.io-blue?logo=docker&logoColor=white)](https://github.com/mbalalaj10/simple-yt-notifier/pkgs/container/simple-yt-notifier)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12431/badge)](https://www.bestpractices.dev/projects/12431/badge)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/mbalalaj10/simple-yt-notifier/badge)](https://scorecard.dev/viewer/?uri=github.com/mbalalaj10/simple-yt-notifier)

## Background and Purpose
Simple YT Notifier is a lightweight Node.js app that resolves the problem of missing out on content from youtube creator channels you subscribe to.
It automatically monitors a specific channel and alerts you immediately when a new video is posted or when a livestream has started using a proven API from YouTube that sends alerts, which in turn gets sent as a Discord Webhook to a specific Discord server channel.

Simple YT Notifier is primarily designed for you to self-host it using the provided Docker image, meaning that you won't have to deal with unreliable or paywalled Discord bots that only send notifications after like 5-30 minutes, and also since the app is designed to get a notification from YouTube rather than watch subscription feeds constantly.

Simple YT Notifier uses YouTube's Pub/SubHubbub API to subscribe to channels and recieve notifications on demand.

## Docker Container Installation/Deployment

As mentioned, the app can run as a Docker container. Below are the steps on setting up and running your own container instance of the app using docker-compose.

In this instance, we will use the example docker-compose provided below:

```
services:
  yt-notifier:
    image: ghcr.io/mbalalaj10/simple-yt-notifier:latest
    container_name: simple-yt-notifier
    restart: unless-stopped
    ports:
      - "3000:3000" 
    environment:
      - PORT=3000
      - DISCORD_WEBHOOK=
      - CHANNEL_ID=
      - YT_API_KEY=
      - APP_URL=
      - HUB_SECRET=
      - DISCORD_ROLE_ID=
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

1. Create a docker-compose.yml and implement the example above.
2. Ensure you have the environment variables set as explained here:
    - **PORT:** The internal port the application listens to. Set to 3000 by default.
    - **DISCORD_WEBHOOK:** The full URL of the Discord Webhook where the notifications will be sent out.
    - **CHANNEL_ID:** The YouTube Channel ID of the channel you wish to monitor. Begins with `UC...`
    - **YT_API_KEY:** Your Google Cloud Console API key with the required YouTube Data API v3 enabled. More information on how to get it: 
    - **APP_URL:** The publicly accessible URL of this container. For example: https://notifier.yourdomain.com
    - **HUB_SECRET:** A cryptographically strong random string used to verify that incoming notifications actually come from YouTube. The app currently does not generate one for you automatically, so make sure to generate a strong one to make sure the app does not send you arbitrary webhook messages to your Discord channel.
    - **DISCORD_ROLE_ID (Optional):** The Discord Role ID of the role you wish for the webhook to ping you. If not specified, defaults to an `@everyone` Ping.
3. Once the file is composed, deploy the container using `docker compose up -d` or with an equivalent command.

## Repository Information:
- For contributing to this project and reporting general issues and bugs, see LINK
- For reporting security vulnerabilities, see LINK

## Extra Acknowledgements and References:
insert info