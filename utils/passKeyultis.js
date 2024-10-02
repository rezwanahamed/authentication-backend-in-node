const Passkey = require('../models/PassKey');

const generatePasskey = (length = 10) => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let passkey = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        passkey += characters[randomIndex];
    }

    return passkey;
};

const saveGeneratedPasskey = async (email) => {
    const existingPasskey = await Passkey.findOne({ email: email });
    if (existingPasskey) {
        await existingPasskey.deleteMany({ email: email });
    }

    for (let i = 0; i < 5; i++) {
        const passkey = generatePasskey();
        const newPasskey = Passkey({ email: email, passkey: passkey });
        await newPasskey.save();
    }
};

const verifyPasskey = async (email, passkey) => {
    try {
        const foundPasskey = await Passkey.findOne({ email, passkey });

        if (!foundPasskey) {
            return false;
        }

        await foundPasskey.deleteOne();
        return true;
    } catch (error) {
        console.error('Error verifying passkey:', error);
        return false;
    }
};

module.exports = { saveGeneratedPasskey, verifyPasskey };