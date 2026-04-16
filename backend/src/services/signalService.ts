import { Signal, Candle, IndicatorValues } from '../types';
import { IndicatorService } from './indicatorService';

export class SignalService {
  // Weighted signal generation algorithm
  static generateSignal(candles: Candle[]): Signal {
    if (candles.length < 50) {
      return this.createNeutralSignal(candles[0].timestamp);
    }

    const indicators = IndicatorService.calculateAllIndicators(candles);
    const currentCandle = candles[candles.length - 1];
    const prevCandle = candles[candles.length - 2];

    // Calculate weighted scores for each indicator
    const scores = this.calculateIndicatorScores(indicators, currentCandle, prevCandle);
    const totalScore = this.calculateTotalScore(scores);
    const confidence = this.calculateConfidence(scores);

    // Generate signal based on scores
    const signal = this.determineSignal(totalScore);

    return {
      symbol: 'SYMBOL', // Will be replaced with actual symbol
      timestamp: new Date(),
      signal,
      confidence,
      indicators: {
        ma9: indicators.ma9,
        ma20: indicators.ma20,
        ma50: indicators.ma50,
        rsi: indicators.rsi,
        macd: indicators.macd,
        macdSignal: indicators.macdSignal,
        bollingerUpper: indicators.bollingerUpper,
        bollingerLower: indicators.bollingerLower,
        volume: currentCandle.volume,
        volumeMA: indicators.volumeMA
      }
    };
  }

  // Calculate scores for each indicator (0-100)
  private static calculateIndicatorScores(indicators: IndicatorValues, currentCandle: Candle, prevCandle: Candle) {
    return {
      // Moving Average score (25% weight)
      ma: this.calculateMAScore(indicators, currentCandle),
      // RSI score (25% weight)
      rsi: this.calculateRSIScore(indicators.rsi),
      // MACD score (25% weight)
      macd: this.calculateMACDScore(indicators),
      // Volume score (15% weight)
      volume: this.calculateVolumeScore(currentCandle, indicators.volumeMA),
      // Bollinger Bands score (10% weight)
      bollinger: this.calculateBollingerScore(currentCandle, indicators)
    };
  }

  private static calculateMAScore(indicators: IndicatorValues, candle: Candle): number {
    let score = 50; // Neutral
    const price = candle.close;

    // Check if price is above all MAs (bullish)
    if (price > indicators.ma9 && indicators.ma9 > indicators.ma20 && indicators.ma20 > indicators.ma50) {
      score = 75;
    }
    // Check if price is below all MAs (bearish)
    else if (price < indicators.ma9 && indicators.ma9 < indicators.ma20 && indicators.ma20 < indicators.ma50) {
      score = 25;
    }
    // Price above key MAs
    else if (price > indicators.ma20) {
      score = 65;
    }
    // Price below key MAs
    else if (price < indicators.ma20) {
      score = 35;
    }

    return score;
  }

  private static calculateRSIScore(rsi: number): number {
    // RSI > 70 = overbought (bearish)
    if (rsi > 70) return 30;
    // RSI < 30 = oversold (bullish)
    if (rsi < 30) return 70;
    // RSI 40-60 = neutral
    if (rsi >= 40 && rsi <= 60) return 50;
    // RSI 30-40 = mild bullish
    if (rsi >= 30 && rsi < 40) return 60;
    // RSI 60-70 = mild bearish
    return 40;
  }

  private static calculateMACDScore(indicators: IndicatorValues): number {
    const histogram = indicators.macd - indicators.macdSignal;
    
    // Strong bullish: MACD > Signal and both positive
    if (histogram > 0 && indicators.macd > 0) return 70;
    // Strong bearish: MACD < Signal and both negative
    if (histogram < 0 && indicators.macd < 0) return 30;
    // Weak bullish
    if (histogram > 0) return 60;
    // Weak bearish
    if (histogram < 0) return 40;
    
    return 50;
  }

  private static calculateVolumeScore(candle: Candle, volumeMA: number): number {
    // Volume confirmation
    if (candle.volume > volumeMA * 1.2) return 60;
    if (candle.volume < volumeMA * 0.8) return 40;
    return 50;
  }

  private static calculateBollingerScore(candle: Candle, indicators: IndicatorValues): number {
    const price = candle.close;
    
    // Price near upper band (potential reversal, bearish)
    if (price > indicators.bollingerUpper * 0.98) return 35;
    // Price near lower band (potential reversal, bullish)
    if (price < indicators.bollingerLower * 1.02) return 65;
    // Price in middle (neutral)
    
    return 50;
  }

  private static calculateTotalScore(scores: any): number {
    // Weighted average
    const weights = {
      ma: 0.25,
      rsi: 0.25,
      macd: 0.25,
      volume: 0.15,
      bollinger: 0.10
    };

    return (
      scores.ma * weights.ma +
      scores.rsi * weights.rsi +
      scores.macd * weights.macd +
      scores.volume * weights.volume +
      scores.bollinger * weights.bollinger
    );
  }

  private static calculateConfidence(scores: any): number {
    const values = Object.values(scores);
    const average = values.reduce((a: number, b: number) => a + b) / values.length;
    const variance = values.reduce((acc: number, val: number) => acc + Math.pow(val - average, 2), 0) / values.length;
    
    // Lower variance = higher confidence
    const confidence = Math.max(0, Math.min(100, 100 - variance / 10));
    return Math.round(confidence);
  }

  private static determineSignal(score: number): 'BUY' | 'SELL' | 'NEUTRAL' {
    if (score > 60) return 'BUY';
    if (score < 40) return 'SELL';
    return 'NEUTRAL';
  }

  private static createNeutralSignal(timestamp: Date): Signal {
    return {
      symbol: 'SYMBOL',
      timestamp,
      signal: 'NEUTRAL',
      confidence: 0,
      indicators: {
        ma9: 0, ma20: 0, ma50: 0, rsi: 50,
        macd: 0, macdSignal: 0,
        bollingerUpper: 0, bollingerLower: 0,
        volume: 0, volumeMA: 0
      }
    };
  }
}
