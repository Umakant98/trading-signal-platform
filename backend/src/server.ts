import express, { Express, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.get('/api/signals/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  res.json({ symbol, signal: 'NEUTRAL', confidence: 50 });
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('subscribe', (data) => {
    console.log(`Client ${socket.id} subscribed to ${data.symbol}`);
    socket.join(data.symbol);
  });

  socket.on('unsubscribe', (data) => {
    console.log(`Client ${socket.id} unsubscribed from ${data.symbol}`);
    socket.leave(data.symbol);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.BACKEND_PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✅ Trading Signal Platform Backend running on port ${PORT}`);
});

export { app, io };
