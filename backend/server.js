const express = require("express");
const connectToDb = require("./config/db");
const { PORT } = require("./config/env");
const router = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: function (origin, callback) {
            return callback(null, true);
        },
        optionsSuccessStatus: 200,
        credentials: true,
    })
);

app.use(express.json({ limit: "50mb" }));

app.use(router);

connectToDb();

app.listen(PORT, console.log(`Backend is running on port: ${PORT}`));