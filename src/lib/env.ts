import { z } from "zod";

const razorpaySecretSchema = z.preprocess(
  () => process.env.RAZORPAY_SECRET_SECRET ?? process.env.RAZORPAY_KEY_SECRET ?? process.env.RAZORPAY_SECRET,
  z.string().min(1)
);

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.preprocess(
    (str) => process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : str,
    z.string().url()
  ),
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_URL_ENDPOINT: z.string().url(),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_SECRET_SECRET: razorpaySecretSchema,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  GMAIL_USER: z.string().email(),
  GMAIL_PASSWORD: z.string().min(1),
  REACT_APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);
