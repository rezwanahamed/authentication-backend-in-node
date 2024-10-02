const mongoose = require('mongoose');

const passkeySchema = new mongoose.Schema({
    email: {type: String, required: true },
    passkey: { type: String, required: true },
});

const Passkey = mongoose.model('Passkey', passkeySchema);
module.exports = Passkey;
