const mongoose = require("mongoose");


let dbConnection;

const connectToDatabase = async (
   trialsLeft =2
) => {
    if (trialsLeft === 0 || trialsLeft < 0) {
        console.info("Database connection failed");
        return;
    }
    try {
        const data = await mongoose.connect(process.env.DATABASEURL);
        dbConnection = data.connection;
        console.info("[SERVER] Database connected");
    } catch (error) {
        console.error(error);
        console.info(`[SERVER] Database connection failed. Trials left: ${trialsLeft}`);
        setTimeout(() => {
            connectToDatabase(trialsLeft - 1);
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