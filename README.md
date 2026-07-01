# 🌤 WeatherApp

A visually-appealing weather dashboard built with **React + Vite**.  
Search any city and instantly see the **current weather** plus a **7-day forecast** — no API key required.

## Features

- 🔍 **City search** – autocomplete-friendly input powered by Open-Meteo Geocoding
- 🌡️ **Current conditions** – temperature, feels-like, humidity, wind, pressure, precipitation
- 📅 **7-day forecast** – daily high/low, weather condition, precipitation, max wind
- 🌐 **Country flag** displayed alongside the city name
- 📱 **Fully responsive** – works on desktop, tablet and mobile
- 🎨 **Glass-morphism UI** with a dark gradient background

## Tech Stack

| Layer        | Technology |
|--------------|------------|
| Framework    | React 19 + Vite |
| Styling      | Plain CSS (glass-morphism, CSS custom properties) |
| Weather API  | [Open-Meteo](https://open-meteo.com/) (free, no key) |
| Geocoding    | Open-Meteo Geocoding API |

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```
