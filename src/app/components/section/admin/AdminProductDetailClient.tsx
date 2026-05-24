"use client";

import {useRouter} from "next/navigation";
import Link from "next/link";
import {CalendarDays, Edit3, Image as ImageIcon, ArrowLeft} from "lucide-react";
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
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <Link href="/admin/products" className="btn btn-ghost btn-sm gap-2 w-fit">
                        <ArrowLeft className="h-4 w-4" />
                        Back to products
                    </Link>
                    <h1 className="mt-3 text-3xl font-black tracking-tight">{product.name}</h1>
                    <p className="mt-2 text-base-content/60">View product details and update the record on the same page.</p>
                </div>

                <div className="rounded-2xl border border-base-200 bg-base-100 px-4 py-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2 font-semibold">
                        <CalendarDays className="h-4 w-4" />
                        Product details
                    </div>
                    <p className="mt-1 text-base-content/60">Created or updated in the catalog</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
                <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                        <ImageIcon className="h-4 w-4" />
                        Preview
                    </div>
                    <div className="mt-4 overflow-hidden rounded-3xl border border-base-200 bg-base-200/60">
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
                            className="aspect-square h-full w-full object-cover"
                        />
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-sm text-base-content/60">Description</p>
                            <p className="mt-1 text-sm leading-6">{product.description}</p>
                        </div>
                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-sm text-base-content/60">Image path</p>
                            <p className="mt-1 break-all text-sm font-medium">{normalizeImagePath(product.imageUrl)}</p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-base-200 p-4">
                        <p className="text-sm text-base-content/60">Updated at</p>
                        <p className="mt-1 text-sm font-medium">{formatDate(product.updatedAt)}</p>
                    </div>
                </section>

                <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                        <Edit3 className="h-4 w-4" />
                        Edit product
                    </div>
                    <AdminProductForm initialData={product} onSuccess={() => router.refresh()} />
                </section>
            </div>

            <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold">Variants</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="table w-full">
                        <thead>
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
