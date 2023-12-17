import {config} from "../../config/default";
import mongoose from "mongoose";


const dbUrl = config.get("databaseUrl");
export let dbConnection;

export const connectToDatabase = async (
    databaseUrl,
    trialsLeft = 3
) => {
    if (trialsLeft === 0 || trialsLeft < 0) {
        console.info("Database connection failed");
        return;
    }
    try {
        const data = await mongoose.connect(dbUrl);
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

export const disconnectFromDatabase = async () => {
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
