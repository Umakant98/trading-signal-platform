import { Candle, IndicatorValues } from '../types';

export class IndicatorService {
  // Calculate Exponential Moving Average
  static calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
    
    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * multiplier + ema * (1 - multiplier);
    }
    
    return Math.round(ema * 100) / 100;
  }

  // Calculate RSI (Relative Strength Index)
  static calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const diff = prices[prices.length - i] - prices[prices.length - i - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    return Math.round(rsi * 100) / 100;
  }

  // Calculate MACD (Moving Average Convergence Divergence)
  static calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    
    // Signal line is 9-period EMA of MACD
    const signal = this.calculateEMA([macd], 9);
    
    return {
      macd: Math.round(macd * 100) / 100,
      signal: Math.round(signal * 100) / 100,
      histogram: Math.round((macd - signal) * 100) / 100
    };
  }

  // Calculate Bollinger Bands
  static calculateBollingerBands(prices: number[], period: number = 20, stdDevMultiplier: number = 2): { upper: number; middle: number; lower: number } {
    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((a, b) => a + b) / period;
    
    const variance = recentPrices.reduce((acc, price) => acc + Math.pow(price - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: Math.round((sma + stdDevMultiplier * stdDev) * 100) / 100,
      middle: Math.round(sma * 100) / 100,
      lower: Math.round((sma - stdDevMultiplier * stdDev) * 100) / 100
    };
  }

  // Calculate Volume Moving Average
  static calculateVolumeMA(volumes: number[], period: number = 20): number {
    if (volumes.length < period) return 0;
    
    const recentVolumes = volumes.slice(-period);
    const volumeMA = recentVolumes.reduce((a, b) => a + b) / period;
    
    return Math.round(volumeMA);
  }

  // Main method to calculate all indicators
  static calculateAllIndicators(candles: Candle[]): IndicatorValues {
    const closes = candles.map(c => c.close);
    const volumes = candles.map(c => c.volume);
    
    const ma9 = this.calculateEMA(closes, 9);
    const ma20 = this.calculateEMA(closes, 20);
    const ma50 = this.calculateEMA(closes, 50);
    const rsi = this.calculateRSI(closes);
    
    const { macd, signal: macdSignal } = this.calculateMACD(closes);
    const { upper: bbUpper, middle: bbMiddle, lower: bbLower } = this.calculateBollingerBands(closes);
    const volumeMA = this.calculateVolumeMA(volumes);
    
    return {
      ma9,
      ma20,
      ma50,
      rsi,
      macd,
      macdSignal,
      bollingerUpper: bbUpper,
      bollingerMiddle: bbMiddle,
      bollingerLower: bbLower,
      volumeMA
    };
  }
}
