import React, { useState, useEffect } from 'react';
import './App.css';

interface Signal {
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  timestamp: string;
}

function App() {
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('5m');

  useEffect(() => {
    // Simulate signal generation
    const mockSignal: Signal = {
      signal: 'BUY',
      confidence: 75,
      timestamp: new Date().toISOString()
    };
    setCurrentSignal(mockSignal);
  }, [selectedSymbol, timeframe]);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return '#10B981';
      case 'SELL':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  const getSignalEmoji = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return '🟢';
      case 'SELL':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="App">
      <header style={{ padding: '20px', backgroundColor: '#1F2937', color: '#fff' }}>
        <h1>📈 Trading Signal Platform</h1>
      </header>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)}>
            <option>AAPL</option>
            <option>MSFT</option>
            <option>GOOGL</option>
            <option>TSLA</option>
          </select>

          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
          </select>
        </div>

        {/* Signal Display */}
        {currentSignal && (
          <div
            style={{
              backgroundColor: getSignalColor(currentSignal.signal),
              color: '#fff',
              padding: '40px',
              borderRadius: '10px',
              textAlign: 'center',
              marginBottom: '30px',
              fontSize: '24px'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '10px' }}>
              {getSignalEmoji(currentSignal.signal)}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
              {currentSignal.signal}
            </div>
            <div style={{ fontSize: '18px', marginTop: '10px' }}>
              Confidence: {currentSignal.confidence}%
            </div>
          </div>
        )}

        {/* Placeholder for Chart */}
        <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>Price Chart (Coming Soon)</h3>
          <p>Interactive candlestick chart will appear here</p>
        </div>

        {/* Placeholder for Indicators */}
        <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '10px' }}>
          <h3>Technical Indicators</h3>
          <p>Real-time indicator values will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default App;
