import Razorpay from "razorpay";

function resolveRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
}

function resolveRazorpayKeySecret() {
  return process.env.RAZORPAY_SECRET_SECRET ?? process.env.RAZORPAY_KEY_SECRET ?? process.env.RAZORPAY_SECRET;
}

export function getRazorpayClient() {
  const keyId = resolveRazorpayKeyId();
  const keySecret = resolveRazorpayKeySecret();

  if (!keyId) {
    throw new Error("Razorpay key ID is not configured. Set RAZORPAY_KEY_ID.");
  }

  if (!keySecret) {
    throw new Error("Razorpay secret key is not configured. Set RAZORPAY_SECRET_SECRET, RAZORPAY_KEY_SECRET, or RAZORPAY_SECRET.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}