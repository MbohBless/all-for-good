const mongoose = require("mongoose");


let dbConnection;

const connectToDatabase = async (
    databaseUrl,
    trialsLeft
) => {
    if (trialsLeft === 0 || trialsLeft < 0) {
        console.info("Database connection failed");
        return;
    }
    try {
        const data = await mongoose.connect(databaseUrl);
        dbConnection = data.connection;
        console.info("[SERVER] Database connected");
    } catch (error) {
        console.error(error);
        console.info(`[SERVER] Database connection failed. Trials left: ${trialsLeft}`);
        setTimeout(() => {
            connectToDatabase(trls - 1);
        }, 2000);
    }
};

const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.info("[SERVER] Database disconnected");
    } catch (error) {
        console.error(error)
        console.info("[SERVER] Database disconnection failed. Retrying...");
        setTimeout(() => {
            disconnectFromDatabase();
        }, 2000);
    }
};

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
    dbConnection
};