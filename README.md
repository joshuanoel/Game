# 🕹️ 3D Platformer Game

Welcome to my **3D platformer game**, hosted live at **[joshuanoel.net](https://joshuanoel.net)**.  

It’s a full-stack project built as a monorepo with a TypeScript backend, frontend, and shared libraries.

The game features real-time multiplayer gameplay using WebSockets, allowing players to navigate a 3D environment, jump between platforms, and avoid obstacles.

## 🚀 Tech Stack

- **Backend** → [NestJS](https://nestjs.com/)  
- **Frontend** → [Parcel](https://parceljs.org/) + WebGL
- **Shared Libraries** → Custom TypeScript packages (reused across frontend & backend)
- **Deployment** → Dockerized + hosted on [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)


## 📦 Monorepo Structure

```
.
├── apps/
│   ├── client/     # Web client
│   └── server/     # NestJS backend
│
├── libs/
│   └── shared/     # Shared TypeScript code
│
├── package.json
└── tsconfig.base.json
```


## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v8+ recommended)

### Install Dependencies

```bash
npm ci
```

### Run in Development Mode

This command starts both the frontend and backend in watch mode. The backend will run on `http://localhost:3000`, serving the frontend as static files and handling WebSocket connections.

```bash
npm run dev
```

### Build and Run in Production Mode

The following commands build the entire monorepo and start the backend. The backend will run on `http://localhost:3000`, serving the built frontend and handling WebSocket connections.

```bash
npm run build
npm start
```

### Build and Run with Docker

A `Dockerfile` is provided to build and run the entire monorepo in a Docker container.

```bash
docker build -t game .
docker run -p 3000:3000 game
```
