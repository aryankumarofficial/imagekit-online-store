import User from "@/models/User";
import { env } from "@/lib/env";
import crypto from "crypto";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function ensureAdminUser() {
    try {
        if (process.env.NODE_ENV === "production" && process.env.ALLOW_AUTO_ADMIN_SEED !== "true") {
            console.warn("Skipping automatic admin bootstrap in production.");
            return;
        }

        if (!ADMIN_EMAIL) {
            console.warn("ADMIN_EMAIL is not set; skipping automatic admin bootstrap.");
            return;
        }

        console.log("Checking for admin user...");
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        console.log("Admin user not found. Creating new admin user...");

        // Generate strong random password
        const password = crypto.randomBytes(16).toString("hex");

        // Create admin user
        const newAdmin = new User({
            email: ADMIN_EMAIL,
            password: password,
            role: "admin",
            isVerified: new Date(),
        });

        await newAdmin.save();
        console.log("Admin user created successfully.");

        // Send email with credentials
        await sendAdminCredentials(ADMIN_EMAIL, password);

    } catch (error) {
        console.error("Error ensuring admin user:", error);
    }
}

async function sendAdminCredentials(email: string, password: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: env.GMAIL_USER,
                pass: env.GMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: env.GMAIL_USER,
            to: email,
            subject: "Your Admin Credentials - ImageKit Store",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Welcome Admin!</h2>
                    <p>An admin account has been automatically created for you at ImageKit Store.</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p>Please login and change your password immediately.</p>
                    <p><a href="${env.NEXTAUTH_URL}/login">Login Here</a></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Admin credentials sent to ${email}`);

    } catch (error) {
        console.error("Failed to send admin credentials email:", error);
        // We do not re-throw because we don't want to crash the app or retry the admin creation loop infinitely if email fails
        // But the admin user IS created, so next time it won't try to create and send email.
        // This is a trade-off. If email fails, the user is locked out unless they reset password or check DB.
        // Given the instructions "Fail gracefully if email delivery fails (do not crash the app)", this is acceptable.
    }
}
