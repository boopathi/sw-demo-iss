# Iss Tracker - Service Worker Demo

Tracks the current location of ISS using open-notify APIs and Google Maps APIs.

## Requirements

+ node > 0.11.0

## Usage

#### Install dependencies

`npm install`

#### Get a Google API Key

+ [Google Developer's console](https://console.developers.google.com/)
+ Create a new Project
+ Enable Google Maps JavaScript API v3
+ Generate a Public API key
+ Copy this key

#### Start the server

+ `export SW_DEMO_ISS_GMAPS_API="API-KEY-FROM-PREVIOUS-STEP"`
+ `npm start`
