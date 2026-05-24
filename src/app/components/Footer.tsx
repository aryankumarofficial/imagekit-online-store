
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base-100/80 text-base-content backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-black tracking-tight">ImageKit Shop</h3>
            <p className="max-w-xs text-sm leading-6 text-base-content/70">
              A clean digital storefront for optimized image assets, flexible licenses, and instant, secure checkout.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="link link-hover">Home</Link>
              </li>
              <li>
                <Link href="/about" className="link link-hover">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="link link-hover">Contact Us</Link>
              </li>
              <li>
                <Link href="/orders" className="link link-hover">My Orders</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="link link-hover">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="link link-hover">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="link link-hover">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider my-8"></div>

        <div className="text-center text-sm text-base-content/60">
          <p>&copy; {new Date().getFullYear()} ImageKit Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
