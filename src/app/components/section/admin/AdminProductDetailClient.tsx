"use client";

import {useRouter} from "next/navigation";
import Link from "next/link";
import {CalendarDays, Edit3, Image as ImageIcon, ArrowLeft, Layers3, Tag, Sparkles} from "lucide-react";
import {IProduct, IMAGE_VARIANTS} from "@/models/Product";
import AdminProductForm from "./AdminProductForm";
import {normalizeImagePath} from "@/lib/imagekit-url";
import {IKImage} from "imagekitio-next";

type AdminProductDetail = IProduct & {
    createdAt?: string | Date;
    updatedAt?: string | Date;
};

function formatDate(value?: Date | string) {
    if (!value) return "—";
    return new Date(value).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AdminProductDetailClient({product}: {product: AdminProductDetail}) {
    const router = useRouter();

    return (
        const prices = product.variants.map((variant) => variant.price);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 0;
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-8 pb-8">
                <section className="overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm">
                    <div className="grid gap-6 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-6 py-8 lg:grid-cols-[1.4fr_1fr] lg:px-8 lg:py-10">
                        <div className="space-y-4">
                            <Link href="/admin/products" className="btn btn-ghost btn-sm gap-2 w-fit">
                                <ArrowLeft className="h-4 w-4" />
                                Back to products
                            </Link>

                            <div className="space-y-3">
                                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                    Product details
                                </div>
                                <h1 className="text-4xl font-black tracking-tight lg:text-5xl">{product.name}</h1>
                                <p className="max-w-2xl text-base leading-7 text-base-content/70 lg:text-lg">
                                    Inspect the product preview, review its variants, and update everything from the editor on the same page.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-base-content/70">
                                <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">{product.variants.length} variants</span>
                                <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">₹{minPrice.toFixed(2)} - ₹{maxPrice.toFixed(2)}</span>
                                <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">Updated {formatDate(product.updatedAt)}</span>
                            </div>
                        </div>

                        <div className="grid gap-3 rounded-3xl border border-base-200 bg-base-100/80 p-5 shadow-sm backdrop-blur">
                            <div className="rounded-2xl bg-base-200 px-4 py-3">
                                <p className="text-sm text-base-content/60">Product ID</p>
                                <p className="mt-1 break-all text-sm font-semibold">{product._id?.toString() || "—"}</p>
                            </div>
                            <div className="rounded-2xl bg-base-200 px-4 py-3">
                                <p className="text-sm text-base-content/60">Preview path</p>
                                <p className="mt-1 break-all text-sm font-semibold">{normalizeImagePath(product.imageUrl)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                            <ImageIcon className="h-4 w-4" />
                            Visual preview
                        </div>
                        <div className="mt-4 overflow-hidden rounded-3xl border border-base-200 bg-base-200/60">
                            <div className="relative aspect-[4/3] w-full max-h-[520px]">
                                <IKImage
                                    urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                                    path={normalizeImagePath(product.imageUrl)}
                                    alt={product.name}
                                    transformation={[
                                        {
                                            width: IMAGE_VARIANTS.SQUARE.dimensions.width.toString(),
                                            height: IMAGE_VARIANTS.SQUARE.dimensions.height.toString(),
                                            cropMode: "extract",
                                            focus: "center",
                                            quality: 80,
                                        },
                                    ]}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-base-200 p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
                                    <Layers3 className="h-4 w-4" />
                                    Variants
                                </div>
                                <p className="mt-2 text-2xl font-black">{product.variants.length}</p>
                            </div>
                            <div className="rounded-2xl bg-base-200 p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
                                    <Tag className="h-4 w-4" />
                                    Price range
                                </div>
                                <p className="mt-2 text-2xl font-black">₹{minPrice.toFixed(2)}</p>
                                <p className="text-sm text-base-content/60">to ₹{maxPrice.toFixed(2)}</p>
                            </div>
                            <div className="rounded-2xl bg-base-200 p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
                                    <Sparkles className="h-4 w-4" />
                                    Last updated
                                </div>
                                <p className="mt-2 text-sm font-medium leading-6">{formatDate(product.updatedAt)}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-base-200 p-4">
                                <p className="text-sm text-base-content/60">Description</p>
                                <p className="mt-1 text-sm leading-6 text-base-content/80">{product.description}</p>
                            </div>
                            <div className="rounded-2xl bg-base-200 p-4">
                                <p className="text-sm text-base-content/60">Image path</p>
                                <p className="mt-1 break-all text-sm font-medium text-base-content/80">{normalizeImagePath(product.imageUrl)}</p>
                            </div>
                        </div>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                        Edit product
                    </div>
                    <AdminProductForm initialData={product} onSuccess={() => router.refresh()} />
                </section>
            </div>

            <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold">Variants</h2>
                <div className="mt-4 overflow-x-auto">
                <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-xl font-bold">Variants</h2>
                            <p className="mt-1 text-sm text-base-content/60">Pricing and licensing for each size option.</p>
                        </div>
                        <div className="rounded-full border border-base-300 bg-base-200 px-3 py-1 text-sm text-base-content/70">
                            {product.variants.length} total variants
                        </div>
                    </div>
                            <tr>
                                <th>Type</th>
                                <th>Price</th>
                                <th>License</th>
                                <th>Dimensions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.variants.map((variant) => (
                                <tr key={`${variant.type}-${variant.license}`}>
                                    <td className="font-medium">{IMAGE_VARIANTS[variant.type].label}</td>
                                    <td>₹{variant.price.toFixed(2)}</td>
                                    <td className="capitalize">{variant.license}</td>
                                    <td>{IMAGE_VARIANTS[variant.type].dimensions.width} x {IMAGE_VARIANTS[variant.type].dimensions.height}px</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
