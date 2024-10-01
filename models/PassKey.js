const generatePasskey = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let passkey = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        passkey += characters[randomIndex];
    }
    
    return passkey;
};

// Generate and display example passkeys
const examplePasskeys = [];
for (let i = 0; i < 5; i++) {
    examplePasskeys.push(generatePasskey());
}

console.log(examplePasskeys);