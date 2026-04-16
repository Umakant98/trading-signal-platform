// indicatorService.ts

// Exponential Moving Average (EMA)
function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    return prices.reduce((acc, price, index) => {
        if (index === 0) return [price];
        const ema = (price - acc[index - 1]) * k + acc[index - 1];
        acc.push(ema);
        return acc;
    }, []);
}

// Relative Strength Index (RSI)
function calculateRSI(prices, period) {
    const gains = Array(prices.length).fill(0);
    const losses = Array(prices.length).fill(0);

    for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains[i] = change;
        else losses[i] = -change;
    }

    const averageGain = calculateEMA(gains, period);
    const averageLoss = calculateEMA(losses, period);
    const rs = averageGain[averageGain.length - 1] / averageLoss[averageLoss.length - 1];
    return 100 - (100 / (1 + rs));
}

// Moving Average Convergence Divergence (MACD)
function calculateMACD(prices, shortPeriod, longPeriod, signalPeriod) {
    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);
    const macdLine = shortEMA.map((val, index) => val - longEMA[index]);
    const signalLine = calculateEMA(macdLine, signalPeriod);
    return { macdLine, signalLine };
}

// Bollinger Bands
function calculateBollingerBands(prices, period, multiplier) {
    const movingAverage = calculateEMA(prices, period);
    const stdDev = prices.slice(period - 1).map((_, index) => {
        const slice = prices.slice(index, index + period);
        const mean = slice.reduce((sum, value) => sum + value, 0) / period;
        return Math.sqrt(slice.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / period);
    });
    const upperBand = movingAverage.slice(period - 1).map((ma, index) => ma + (stdDev[index] * multiplier));
    const lowerBand = movingAverage.slice(period - 1).map((ma, index) => ma - (stdDev[index] * multiplier));
    return { upperBand, lowerBand, movingAverage };
}

// Volume Moving Average
function calculateVolumeMA(volume, period) {
    return calculateEMA(volume, period);
}

export { calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands, calculateVolumeMA };