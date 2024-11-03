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
    try {
        // Delete all existing passkeys for this email
        await Passkey.deleteMany({ email: email });

        // Generate and save 5 new passkeys
        const passkeys = [];
        for (let i = 0; i < 5; i++) {
            const passkey = generatePasskey();
            const newPasskey = new Passkey({ email: email, passkey: passkey });
            await newPasskey.save();
            passkeys.push(passkey);
        }

        return passkeys;
    } catch (error) {
        console.error('Error in saveGeneratedPasskey:', error);
        throw error;
    }
};

const getGeneratedPasskeys = async (email) => {
    const passkeys = await Passkey.find({ email });
    return passkeys;
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

module.exports = { saveGeneratedPasskey, verifyPasskey, getGeneratedPasskeys };