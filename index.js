// Simple YT Notifier - A lightweight Node.js app to notify Discord of new YouTube videos and livestreams from a specific channel using YouTube's Pub/SubHubbub system.
// MADE ON NOVEMBER 7TH, 2025
// UPDATED ON APRIL 9TH, 2026

import express from "express";
import fetch from "node-fetch";
import getRawBody from "raw-body";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const {
  PORT = 3000,
  DISCORD_WEBHOOK,
  CHANNEL_ID,
  YT_API_KEY,
  APP_URL,
  DISCORD_ROLE_ID,
  HUB_SECRET
} = process.env;

let dynamicChannelName = ""; // Will be set after validation

// Check HUB_SECRET. If not exist, stop everything as a precaution.
if (!HUB_SECRET) {
  console.error("HUB_SECRET environment variable is not set. Exiting for security.");
  process.exit(1);
}

// Memory-based cache for processed video IDs with timestamps
const processedVideos = new Map(); // videoId → timestamp (ms)

// Serve static landing area
app.use(express.static(path.join(__dirname, "public")));
console.log(`Static site serving enabled from /public`);

// Validate Channel ID and fetch Channel Name on startup
async function validateAndFetchChannel() {
  try {
    console.log(`Validating Channel ID ${CHANNEL_ID}.`);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${YT_API_KEY}`
    );
    const json = await res.json();

    if (json.items && json.items.length > 0) {
      dynamicChannelName = json.items[0].snippet.title;
      console.log(`Success: Found channel ${CHANNEL_ID}.`);
      console.log(`Channel Name: "${dynamicChannelName}".`);
      return true;
    } else {
      console.error(`ERROR: Channel ID ${CHANNEL_ID} not found. Check your environment variables.`);
      return false;
    }
  } catch (err) {
    console.error("ERROR: Failed to connect to YouTube API during validation:", err.message);
    return false;
  }
}

// Subscribe to YouTube Pub/SubHubbub feed
async function subscribe() {
  const hubUrl = "https://pubsubhubbub.appspot.com/subscribe";
  const callback = `${APP_URL}/webhook`;

  const params = new URLSearchParams({
    "hub.mode": "subscribe",
    "hub.topic": `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
    "hub.callback": callback,
    "hub.verify": "async",
    "hub.secret": HUB_SECRET,
    "hub.lease_seconds": (60 * 60 * 24 * 8).toString(),
  });

  try {
    const res = await fetch(hubUrl, { method: "POST", body: params });
    if (res.ok) {
      console.log(`Successfully (re)subscribed to YouTube feed for ${CHANNEL_ID}.`);
      console.log(`The channel ${CHANNEL_ID} is now being watched.`);
    } else {
      console.error("ERROR: Subscription failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("ERROR: Subscription request failed:", err);
  }
}

// Starting the server after initial validation
app.listen(PORT, async () => {
  console.log(`Server live on port ${PORT}`);
  console.log(`Webhook now listening on port ${PORT}.`);
  const isValid = await validateAndFetchChannel();
  if (isValid) {
    subscribe();
  } else {
    console.error("CRITICAL: Startup sequence halted due to invalid Channel ID.");
    // Will not exit here to allow for log checking.
  }
});

// Maintenance Intervals
setInterval(async () => {
  if (dynamicChannelName) subscribe(); // Re-subscribe every 4 days to maintain feed connection
}, 4 * 24 * 60 * 60 * 1000);

setInterval(() => {
  const now = Date.now();
  const before = processedVideos.size;
  for (const [videoId, ts] of processedVideos) {
    if (now - ts > 24 * 60 * 60 * 1000) processedVideos.delete(videoId); // Clean up video IDs older than 24 hours
  }
  const after = processedVideos.size;
  if (before !== after) {
    console.log(`Cleaned up ${before - after} old video IDs (cache size: ${after})`);
  }
}, 72 * 60 * 60 * 1000); // Run cleanup every 3 days


// Webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    console.log("=== Incoming webhook POST ===");
    console.log(`Headers: ${JSON.stringify(req.headers)}`);

    // Get raw XML string from the request
    const rawBody = await getRawBody(req, {
      length: req.headers["content-length"],
      limit: "1mb",
      encoding: true,
    });

    // Verify HMAC signature
    const signature = req.headers["x-hub-signature"];
    const hmac = crypto.createHmac("sha1", HUB_SECRET).update(rawBody).digest("hex");

    if (!signature || signature !== `sha1=${hmac}`) {
      console.warn("Invalid HMAC signature, rejecting request.");
      return res.sendStatus(403);
    }

    // XML Payload Processing
    const bodyStr = rawBody.toString();
    console.log("Raw XML payload recieved from Google:");
    console.log(bodyStr);

    const match = bodyStr.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    if (!match) {
      console.log("No <yt:videoId> found in payload, ignoring for now.");
      return res.sendStatus(204);
    }

    const videoId = match[1];
    console.log(`New videoId detected: ${videoId}`);

    // Ignore duplicate notifications
    if (processedVideos.has(videoId)) {
      console.log(`videoId ${videoId} is detected as a duplicate, ignoring for now.`);
      return res.sendStatus(204);
    }

    // Youtube video detail processing
    console.log(`Fetching video details for ${videoId}.`);
    const videoDetailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoId}&key=${YT_API_KEY}`
    );
    const videoDetailsJson = await videoDetailsRes.json();
    const videoInfo = videoDetailsJson.items?.[0];

    if (!videoInfo) {
      console.log(`No video details found for ${videoId} (Video might be private or deleted), ignoring for now.`);
      return res.sendStatus(204);
    }

    const status = videoInfo.snippet.liveBroadcastContent; // fetched video status
    console.log(`Detected YouTube status for ${videoId}: ${status}`);

    // Determining announcement type based on video status
    let announcementType = "";

    if (status === "live") {
      announcementType = "**is now live!**\nCheck out their stream:";
      console.log(`Match found: Processing as LIVESTREAM.`);
    } else if (status === "none") {
      announcementType = "**has uploaded a new video!**\nGo check it out:";
      console.log(`Match found: Processing as UPLOAD.`);
    } else {
      console.log(`Status is ${status} (likely scheduled/upcoming). Video status not met, ignoring for now.`);
      return res.sendStatus(204);
    }

    // Mark as processed to avoid duplicates
    processedVideos.set(videoId, Date.now());

    // Send message to Discord
    const ping = DISCORD_ROLE_ID ? `<@&${DISCORD_ROLE_ID}>` : "@everyone";
    const message = `${ping}\n\n**${dynamicChannelName}** ${announcementType} https://www.youtube.com/watch?v=${videoId}`;
    console.log(`Sending Discord notification for ${CHANNEL_ID}:\n\n${message}`);

    const discordRes = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: message,
        allowed_mentions: { parse: ["roles", "everyone"] },
      }),
    });

    if (!discordRes.ok) {
      const errorText = await discordRes.text();
      console.error("Failed to send Discord message:", discordRes.status, errorText);
    } else {
      console.log("Discord notification sent successfully.");
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.sendStatus(500);
  }
});

// YouTube verification challenge
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const topic = req.query["hub.topic"];

  if (mode && challenge) {
    console.log(`Webhook verification request received: mode=${mode} topic=${topic}`);
    res.status(200).send(challenge);
  } else {
    res.sendStatus(400);
  }
});
