# <img src="public/bell.png" align="left" width="48" height="48"> Simple YT Notifier
A simple and lightweight Node.js app that sends Discord channel notifications about new YouTube videos and livestreams from a specific channel using YouTube's Pub/SubHubbub system.

[![Docker Image](https://img.shields.io/badge/docker-ghcr.io-blue?logo=docker&logoColor=white)](https://github.com/mbalalaj10/simple-yt-notifier/pkgs/container/simple-yt-notifier)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12431/badge)](https://www.bestpractices.dev/projects/12431/badge)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/mbalalaj10/simple-yt-notifier/badge)](https://scorecard.dev/viewer/?uri=github.com/mbalalaj10/simple-yt-notifier)

## Background and Purpose
Simple YT Notifier is a lightweight Node.js app that resolves the problem of missing out on content from youtube creator channels you subscribe to.
It automatically monitors specific channels and alerts you immediately when a new video is posted using a proven API from YouTube that sends alerts, which in turn gets sent as a Discord Webhook to a specific Discord server channel.

Simple YT Notifier is primarily designed for you to self-host it using the provided Docker image, meaning that you won't have to deal with unreliable or paywalled Discord bots that only send notifications after like 5-30 minutes, since the app is designed to get a notification from YouTube rather than watch subscription feeds constantly.

## Docker Setup and Installation

As mentioned, the app can run as a Docker container. Below are the steps on setting up and running your own container instance of the app using docker-compose.

