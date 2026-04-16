import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { SignalService } from './services/signalService';
import { Candle } from './types';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/signals/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  // generate mock candles for now
  const mockCandles: Candle[] = Array.from({ length: 100 }, (_, i) => ({
    timestamp: new Date(Date.now() - (100 - i) * 60000),
    open: 150 + Math.random() * 10,
    high: 155 + Math.random() * 10,
    low: 145 + Math.random() * 10,
    close: 150 + Math.random() * 10,
    volume: Math.floor(Math.random() * 5000000) + 1000000
  }));

  const signal = SignalService.generateSignal(mockCandles, symbol);
  res.json({ success: true, data: signal });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('subscribe', (data) => {
    const { symbol, timeframe } = data || {};
    socket.join(`${symbol}-${timeframe}`);
    // send initial signal
    const mockCandles: Candle[] = Array.from({ length: 100 }, (_, i) => ({
      timestamp: new Date(Date.now() - (100 - i) * 60000),
      open: 150 + Math.random() * 10,
      high: 155 + Math.random() * 10,
      low: 145 + Math.random() * 10,
      close: 150 + Math.random() * 10,
      volume: Math.floor(Math.random() * 5000000) + 1000000
    }));
    const signal = SignalService.generateSignal(mockCandles, symbol);
    socket.emit('signal-update', signal);
  });

  socket.on('unsubscribe', (data) => {
    const { symbol, timeframe } = data || {};
    socket.leave(`${symbol}-${timeframe}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.BACKEND_PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export { app, io };