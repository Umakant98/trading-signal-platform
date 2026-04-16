export interface Signal {
  symbol: string;
  timestamp: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  indicators?: Record<string, number>;
}

export interface Candle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
