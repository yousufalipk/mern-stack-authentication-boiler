const mongoose = require('mongoose');
const { MONGO_DB_URI } = require('./env');

const connectToDb = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(MONGO_DB_URI);
        console.log(`Database connected to host: ${conn.connection.host}`);

    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

module.exports = connectToDb;