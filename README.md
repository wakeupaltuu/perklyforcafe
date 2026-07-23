# ☕ Perkly for Cafes

A multi-tenant loyalty and engagement app for cafes. Built with React, TypeScript, Firebase, and Vite.

## 🚀 Features

### Customer App
- 🔐 **Authentication** — Email/Password + Google Sign-In
- 📱 **QR Check-in** — Scan QR to earn points and track visits
- 🎯 **Loyalty Program** — Earn points with every visit
- 🏆 **Rewards** — Redeem points for free items (coffee, pastries, etc.)
- 👑 **Pass Levels** — Bronze → Silver → Gold (higher pass = better perks)
- 📍 **Cafe Info** — Get directions, rate the cafe, call directly
- 🔔 **Push Notifications** — Stay engaged with automated notifications

### Cafe Owner Dashboard (Coming Soon)
- 📊 **Analytics** — Track visits, points, and customer retention
- 👥 **Member Management** — View and manage customers
- 🎨 **Branding** — Customize logo, hero image, welcome message
- 📱 **QR Code Generator** — Generate unique QR codes for your cafe

### Multi-Tenant Architecture
- One codebase, unlimited cafes
- Each cafe gets its own branded experience
- URL-based routing: `perkly.vercel.app/{cafeSlug}`
- All data isolated per cafe in Firestore

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Firebase Auth | Authentication |
| Firestore | Database |
| Tailwind CSS | Styling |
| Lucide Icons | Icons |
| Motion | Animations |
| Vercel | Hosting |
