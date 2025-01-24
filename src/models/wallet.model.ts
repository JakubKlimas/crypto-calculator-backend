import mongoose, { Schema, Document } from 'mongoose';

const walletSchema = new Schema({
  name: { type: String, required: true, unique: true },
  avatarType: {type: Number, required: true}
});

export const WalletModel = mongoose.model<Document>('Wallet', walletSchema, 'wallets');
