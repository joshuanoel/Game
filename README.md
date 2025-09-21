# 🕹️ 3D Platformer Game

Welcome to my **3D platformer game**, hosted live at **[joshuanoel.net](https://joshuanoel.net)**.  

It’s a full-stack project built as a monorepo with a TypeScript backend, frontend, and shared libraries.

The game features real-time multiplayer gameplay using WebSockets, allowing players to navigate a 3D environment, jump between platforms, and avoid obstacles.

## ✨ Key Features

- 🌐 **Real-time Multiplayer** → WebSocket-powered multiplayer gameplay with multiple concurrent players
- 🎮 **3D Physics Engine** → Custom collision detection, gravity simulation, and movement mechanics
- 🎨 **WebGL Rendering** → Hardware-accelerated 3D graphics with first-person camera controls
- 🤖 **AI Level Generation** → OpenAI-powered procedural level creation with adjustable difficulty
- 🚀 **Dynamic Gameplay** → Levels generate in real-time as players progress forward
- 📱 **Cross-Platform** → Runs in any modern web browser on desktop and mobile
- ⚡ **High Performance** → Optimized 60 FPS gameplay with efficient game loop architecture
- 🏗️ **Modular Architecture** → Clean separation between client, server, and shared game logic

## 🎮 How to Play

### Controls
- **WASD** → Move player character (forward, left, backward, right)
- **Space** → Jump
- **Mouse** → Look around (first-person camera)
- **ESC** → Pause/disconnect

### Gameplay
1. **Join the Game** → Visit [joshuanoel.net](https://joshuanoel.net) and you'll automatically connect
2. **Navigate Platforms** → Use WASD to move and Space to jump between platforms
3. **Avoid Falling** → Stay ahead of the advancing boundary or you'll fall into the void
4. **Compete with Others** → See other players in real-time and race through the levels together

## 🏗️ Architecture Overview

This project demonstrates modern full-stack game development with:

### Client-Side (WebGL Frontend)
- **Rendering Engine** → Custom WebGL-based 3D renderer with efficient batching
- **Game Loop** → 60 FPS game loop with delta time calculations
- **Input System** → Responsive keyboard and mouse input handling
- **Camera System** → First-person camera with smooth movement
- **Network Client** → Socket.IO client for real-time server communication

### Server-Side (NestJS Backend)
- **Game State Management** → Authoritative server with player synchronization
- **WebSocket Gateway** → Real-time bidirectional communication with clients
- **Physics Simulation** → Server-side collision detection and movement validation
- **Level Generation** → Dynamic level creation using AI and procedural algorithms
- **Player Management** → Connection handling, player spawning, and cleanup

### Shared Libraries
- **Game Logic** → Shared game mechanics, actors, and physics between client/server
- **Type Safety** → Consistent TypeScript interfaces across the entire stack
- **Math Utilities** → Vector operations and collision detection algorithms

## 🚀 Tech Stack

- **Backend** → [NestJS](https://nestjs.com/)  
- **Frontend** → [Parcel](https://parceljs.org/) + WebGL
- **Shared Libraries** → Custom TypeScript packages (reused across frontend & backend)
- **Deployment** → Dockerized + hosted on [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
- **AI Integration** → [OpenAI API](https://openai.com/api/) for procedural level generation
- **Real-time Communication** → [Socket.IO](https://socket.io/) for WebSocket connections
- **Build Tools** → TypeScript, Parcel, Docker, GitHub Actions


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

## 🎯 Development Workflow

### Testing Your Changes

1. **Start Development Environment**
   ```bash
   npm run dev
   ```
   This starts all services in watch mode:
   - Frontend dev server on `http://localhost:5173`
   - Backend server on `http://localhost:3000`
   - Shared library compilation in watch mode

2. **Access the Game**
   - Open your browser to `http://localhost:3000`
   - The backend serves the frontend and handles WebSocket connections
   - Changes to code will automatically rebuild and restart services

3. **Test Multiplayer**
   - Open multiple browser tabs to simulate multiple players
   - Each tab represents a different player in the game world

### Code Structure

```
apps/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── display/       # WebGL rendering system
│   │   ├── input/         # Keyboard/mouse input handling
│   │   ├── client/        # Socket.IO client for networking
│   │   ├── controller/    # Player control logic
│   │   └── game.ts        # Main game client class
│   └── public/index.html  # Entry point

├── server/                # Backend application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── game/      # Core game logic and state management
│   │   │   ├── network/   # WebSocket gateway for player communication
│   │   │   └── level/     # Level generation and AI integration
│   │   └── main.ts        # NestJS application bootstrap

libs/
└── shared/                # Shared TypeScript libraries
    ├── src/
    │   ├── game/          # Game mechanics, actors, physics
    │   │   ├── actor/     # Player, cube, and collision systems
    │   │   └── controller/ # Input handling and player control
    │   └── math/          # Vector and matrix operations
```

## 🌐 Deployment

### Production Deployment on DigitalOcean

The project uses a fully automated CI/CD pipeline:

1. **GitHub Actions** → Automatically builds Docker image on every push
2. **DigitalOcean Container Registry** → Stores built Docker images
3. **DigitalOcean App Platform** → Deploys and scales the application

### Manual Deployment

Build and deploy locally:

```bash
# Build the production image
docker build -t game .

# Run in production mode
docker run -p 3000:3000 game
```

### Environment Variables

For production deployments with AI level generation:

```bash
# Required for OpenAI level generation
OPENAI_API_KEY=your_openai_api_key_here
```

## 🔧 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clean node_modules and rebuild
rm -rf node_modules apps/*/node_modules libs/*/node_modules
npm ci
npm run build
```

**Port Already in Use**
```bash
# Kill processes using port 3000
sudo lsof -ti:3000 | xargs kill -9
```

**WebSocket Connection Issues**
- Ensure both frontend and backend are running
- Check browser console for connection errors
- Verify firewall settings allow port 3000

**Performance Issues**
- Check browser console for WebGL errors
- Ensure hardware acceleration is enabled
- Monitor network latency in browser dev tools

### Development Tips

- Use browser dev tools to monitor WebSocket messages
- Enable verbose logging in the client for debugging
- Use multiple browser tabs to test multiplayer functionality
- Check server logs for game state and player management

## 🚀 Build and Run with Docker

A `Dockerfile` is provided to build and run the entire monorepo in a Docker container.

```bash
docker build -t game .
docker run -p 3000:3000 game
```

## 🎨 Screenshots & Demo

🎮 **[Play Live Demo](https://joshuanoel.net)** - Experience the game in action!

*The game features real-time 3D rendering with dynamic lighting, procedurally generated platforms, and smooth multiplayer interactions. Screenshots coming soon!*

## 🤝 Contributing

This is currently a personal project, but feedback and suggestions are welcome!

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the development setup instructions above
4. Make your changes and test thoroughly
5. Submit a pull request with a clear description

### Code Style

- TypeScript with strict mode enabled
- ESLint and Prettier for code formatting
- Modular architecture with clear separation of concerns
- Comprehensive error handling and logging

## 📋 System Requirements

### Minimum Requirements
- **Browser**: Modern browser with WebGL support (Chrome 60+, Firefox 55+, Safari 12+)
- **Memory**: 2GB RAM
- **Graphics**: Integrated graphics or better
- **Network**: Stable internet connection for multiplayer

### Recommended Requirements
- **Browser**: Latest Chrome or Firefox for best performance
- **Memory**: 4GB+ RAM
- **Graphics**: Dedicated GPU for optimal frame rates
- **Network**: Broadband connection (10+ Mbps)

## 📝 License

This project is open source under the MIT License. See [LICENSE](LICENSE) for details.

## 👤 Author

**Joshua Noel**
- Website: [joshuanoel.net](https://joshuanoel.net)
- GitHub: [@joshuanoel](https://github.com/joshuanoel)

---

*Built with ❤️ using TypeScript, NestJS, WebGL, and modern web technologies.*
