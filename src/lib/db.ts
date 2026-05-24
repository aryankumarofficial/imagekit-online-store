import mongoose from "mongoose";
import {ensureAdminUser} from "@/lib/admin-setup";
import {ensureTestUser} from "@/lib/test-user-setup";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    console.log("url", MONGODB_URI);
    throw new Error("Check your Database connection String");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

let isBootstrapChecked = false;

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.log("Error connecting DB: ", e);

        cached.promise = null;
    }

    if (cached.conn && !isBootstrapChecked) {
        try {
            await ensureAdminUser();
        } catch (e) {
            console.error("Failed to ensure admin user:", e);
        }

        try {
            await ensureTestUser();
        } catch (e) {
            console.error("Failed to ensure test user:", e);
        }

        isBootstrapChecked = true;
    }

    return cached.conn;
}

export async function disconnect() {
    if (cached.conn) {
        try {
            await mongoose.disconnect();
            cached.conn = null;
            cached.promise = null;
            console.log("Database connection closed.");
        } catch (e) {
            console.error("Error connecting DB: ", e);
        }
    }
}