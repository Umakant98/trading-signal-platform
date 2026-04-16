import mongoose from 'mongoose';

// Define the signal schema.
const signalSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },
    signalType: {
        type: String,
        enum: ['BUY', 'SELL', 'NEUTRAL'],
        required: true,
    },
    confidence: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    indicators: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});

// Create the model from the schema and export it.
const Signal = mongoose.model('Signal', signalSchema);
export default Signal;
