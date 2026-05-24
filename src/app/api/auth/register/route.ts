import {connectToDatabase} from "@/lib/db";
import User from "@/models/User";
import {NextRequest, NextResponse} from "next/server";
import {sendConfirmationMail} from "@/utils/mails/methods/ConfirmationMail";
import {z} from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

/**
 * Handles registration of a new user
 *
 * @returns {NextResponse} A JSON response with a message
 *                         indicating whether the registration was successful
 *                         or not, and a HTTP status code of 201, 400, or 501
 */
export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const validation = registerSchema.safeParse(payload);
        if (!validation.success) {
            return NextResponse.json(
                {error: "Email and password are required. Password must be at least 8 characters."},
                {status: 400}
            );
        }

        const email = validation.data.email.trim().toLowerCase();
        const password = validation.data.password;

        await connectToDatabase();
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json(
                {error: "User already exists."},
                {status: 400}
            );
        }

        const createdUser = await User.create({
            email,
            password,
            role: "user",
        });

        try {
            await sendConfirmationMail(email);
        } catch (mailError) {
            await User.deleteOne({_id: createdUser._id});
            throw mailError;
        }

        return NextResponse.json(
            {message: "User registered successfully."},
            {status: 201}
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {error: "An error occurred while processing your request."},
            {status: 500}
        );
    }
}
