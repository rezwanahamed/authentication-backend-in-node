const mongoose = require('mongoose');

const connectDB = async () => {
    const baseUri = process.env.MONGODB_URI.split('/').slice(0, 3).join('/');
    const dbName = 'auth-project'; // Your custom database name with dash
    try {
        const conn = await mongoose.connect(`${baseUri}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(
            `MongoDB Connected: ${conn.connection.host} (Database: ${dbName})`
        );
    } catch (error) {
        console.error('error to connect to MongoDB');
        process.exit(1);
    }
};

module.exports = connectDB;
