const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  type: { type: String, enum: ['refresh', 'blacklisted'], required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

tokenSchema.index({ token: 1, type: 1 });
tokenSchema.index({ userId: 1, type: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;