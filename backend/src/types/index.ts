// TypeScript type definitions for Signal, Candle, IndicatorValues

export interface Signal {
    timestamp: Date;
    value: number;
    color: 'Green' | 'Red' | 'Grey';
}

export interface Candle {
    time: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface IndicatorValues {
    ema: number;
    rsi: number;
    macd: number;
    bollingerBands: { upper: number; lower: number; }
    volumeMA: number;
}