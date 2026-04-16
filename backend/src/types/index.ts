export interface Signal {
  symbol: string;
  timestamp: Date;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  indicators: {
    ma9: number;
    ma20: number;
    ma50: number;
    rsi: number;
    macd: number;
    macdSignal: number;
    bollingerUpper: number;
    bollingerLower: number;
    volume: number;
    volumeMA: number;
  };
}

export interface Candle {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketDataResponse {
  symbol: string;
  candles: Candle[];
  lastUpdate: Date;
}

export interface IndicatorValues {
  ma9: number;
  ma20: number;
  ma50: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  volumeMA: number;
}
