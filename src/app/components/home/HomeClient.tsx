"use client";

import Link from "next/link";
import {ArrowRight, BadgeCheck, Layers3, ShieldCheck, Sparkles, Zap} from "lucide-react";
import {IProduct} from "@/models/Product";
import ImageGallery from "@/app/components/section/products/ImageGallery";

interface HomeClientProps {
    products: IProduct[];
}

const featureCards = [
    {
        icon: ShieldCheck,
        title: "Secure checkout",
        description: "Razorpay-powered payments with verified order handling.",
    },
    {
        icon: Zap,
        title: "Fast delivery",
        description: "Optimized previews and instant post-payment access.",
    },
    {
        icon: Layers3,
        title: "Flexible licensing",
        description: "Sell personal and commercial variants from one listing.",
    },
];

function getStartingPrice(product: IProduct) {
    const prices = product.variants.map((variant) => variant.price);
    return prices.length ? Math.min(...prices) : 0;
}

export default function HomeClient({products}: HomeClientProps) {
    const featuredProducts = products.slice(0, 3);

    return (
        <div className="space-y-16 pb-8">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-base-100/80 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-10 lg:p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.16),_transparent_30%)]"/>
                <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-base-content/70">
                            <Sparkles className="h-4 w-4 text-primary"/>
                            Premium image marketplace
                        </div>

                        <div className="space-y-5 max-w-2xl">
                            <h1 className="text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                Sell polished digital images with a storefront that feels premium.
                            </h1>
                            <p className="max-w-xl text-base leading-7 text-base-content/75 sm:text-lg">
                                ImageKit Shop combines optimized image delivery, flexible licensing, and secure payments
                                into a sharper buying experience for creators and customers.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href="#catalog" className="btn btn-primary btn-lg gap-2">
                                Browse catalog
                                <ArrowRight className="h-4 w-4"/>
                            </Link>
                            <Link href="/login" className="btn btn-ghost btn-lg">
                                Sign in
                            </Link>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-base-200/70 p-4">
                                <div className="text-sm text-base-content/60">Listings</div>
                                <div className="mt-1 text-2xl font-black">{products.length.toString().padStart(2, "0")}</div>
                                <div className="text-sm text-base-content/60">ready to browse</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-base-200/70 p-4">
                                <div className="text-sm text-base-content/60">Formats</div>
                                <div className="mt-1 text-2xl font-black">3</div>
                                <div className="text-sm text-base-content/60">image variants per product</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-base-200/70 p-4">
                                <div className="text-sm text-base-content/60">Checkout</div>
                                <div className="mt-1 text-2xl font-black">Secure</div>
                                <div className="text-sm text-base-content/60">Razorpay payments</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-3xl border border-white/10 bg-base-200/70 p-5 shadow-xl shadow-black/20">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.28em] text-base-content/50">Featured previews</p>
                                    <h2 className="mt-2 text-xl font-bold">A storefront built for conversion</h2>
                                </div>
                                <BadgeCheck className="h-6 w-6 text-success"/>
                            </div>

                            <div className="mt-5 space-y-3">
                                {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                                    <Link
                                        key={product._id?.toString()}
                                        href={`/products/${product._id}`}
                                        className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-base-100/70 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold">{product.name}</p>
                                            <p className="mt-1 text-sm text-base-content/60">
                                                From ₹{getStartingPrice(product).toFixed(2)} • {product.variants.length} versions
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 flex-none text-base-content/50 transition-transform duration-300 group-hover:translate-x-1"/>
                                    </Link>
                                )) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-base-100/50 p-5 text-sm text-base-content/65">
                                        Add products to showcase a richer storefront preview.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            {featureCards.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <div key={feature.title} className="rounded-2xl border border-white/10 bg-base-100/70 p-4">
                                        <Icon className="h-5 w-5 text-primary"/>
                                        <h3 className="mt-3 font-semibold">{feature.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-base-content/65">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                {[
                    "Clear product previews with ImageKit transformations",
                    "Mobile-friendly checkout and account flows",
                    "License-aware listings for personal and commercial use",
                ].map((text) => (
                    <div key={text} className="rounded-3xl border border-white/10 bg-base-100/70 p-5 text-sm leading-6 text-base-content/70 shadow-lg shadow-black/10">
                        {text}
                    </div>
                ))}
            </section>

            <section id="catalog" className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-base-content/50">Catalog</p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight">Explore the full collection</h2>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-base-content/65 sm:text-right">
                        Browse optimized previews, compare license options, and move from discovery to checkout without friction.
                    </p>
                </div>

                <ImageGallery products={products}/>
            </section>
        </div>
    );
}