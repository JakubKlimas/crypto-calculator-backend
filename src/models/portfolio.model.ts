import mongoose, { Document, Schema } from 'mongoose';

const portfolioSchema = new Schema({
  walletId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  totalPurchasePrice: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  market: {type:  String, required: true},
  nameAndSymbol: {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
  },
  priceAndAmount: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
      price: { type: Number, required: true },
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

export const PortfolioModel = mongoose.model<Document>('Portfolio', portfolioSchema);
