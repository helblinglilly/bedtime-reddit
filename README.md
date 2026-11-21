# Bedtime Reddit

I like to listen to TTS reddit threads before going to sleep. This project surfaces specific channels via a simple frontend.

Built around the Cloudflare stack

## Reddit ingestor

Calls to the Youtube API are expensive and the free tier includes a limited quota.

This worker runs on a schedule, centered roughly around the channel's upload times, fetches their latest uploads and inserts them into a D1 database.

## Reddit API

Exposes the database table to the public internet as read-only.

## Reddit frontend

SvelteKit based frontend to show the video thumbnails grouped by each day.

## GitHub CI/CD

Deploys all workers on every commit.

CD is owned here as Cloudflare's Git integrations don't work well with monorepos.
