import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "./db"

type APIHandler = (
    req: NextRequest,
    params?: any
)
    => Promise<NextResponse>

export async function withDatabase(handler: APIHandler) {
    return async (req: NextRequest, params?: any) => {
        try {
            const conn = await connectToDatabase();
            if (!conn) {
                throw new Error("Database connection failed");
            }
            console.log("Database connected successfully.");
            return await handler(req, params)
        } catch (e) {
            console.error("API route Error: ", e);
            return NextResponse.json({error: "An internal server error occurred."},
                {status: 500})
        }
    }
}