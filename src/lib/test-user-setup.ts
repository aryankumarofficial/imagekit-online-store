import User from "@/models/User";

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

export async function ensureTestUser() {
    try {
        if (process.env.NODE_ENV === "production" && process.env.ALLOW_AUTO_TEST_USER_SEED !== "true") {
            console.warn("Skipping automatic test-user bootstrap in production.");
            return;
        }

        if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
            console.warn("TEST_USER_EMAIL or TEST_USER_PASSWORD is not set; skipping automatic test-user bootstrap.");
            return;
        }

        const email = TEST_USER_EMAIL.trim().toLowerCase();

        console.log("Checking for verification test user...");
        const existingTestUser = await User.findOne({email});
        if (existingTestUser) {
            console.log("Test user already exists.");
            return;
        }

        console.log("Test user not found. Creating a new verified test user...");

        const newTestUser = new User({
            email,
            password: TEST_USER_PASSWORD,
            role: "user",
            isVerified: new Date(),
        });

        await newTestUser.save();
        console.log("Test user created successfully.");
    } catch (error) {
        console.error("Error ensuring test user:", error);
    }
}