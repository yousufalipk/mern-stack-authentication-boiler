const dotenv = require('dotenv');

dotenv.config();


const PORT = process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_DB_URI;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


module.exports = {
    PORT,
    MONGO_DB_URI,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET
}