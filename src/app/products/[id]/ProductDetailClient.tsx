"use client";

import {IKImage} from "imagekitio-next";
import {IMAGE_VARIANTS, ImageVariant, ImageVariantType, IProduct} from "@/models/Product";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft, Check, Image as ImageIcon} from "lucide-react";
import {useNotification} from "@/app/components/Notification";
import {useSession} from "next-auth/react";
import {apiClient} from "@/lib/api-client";
import {Transformation} from "@imagekit/next";
import Link from "next/link";

export default function ProductDetailClient({product}: {product: IProduct}) {
    const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(null);
    const {showNotification} = useNotification();
    const router = useRouter();
    const {data: session} = useSession();

    useEffect(() => {
        setSelectedVariant(product.variants[0] ?? null);
    }, [product]);

    const handlePurchase = async (variant: ImageVariant) => {
        if (!session) {
            showNotification("Please login to make a purchase", "error");
            router.push("/login");
            return;
        }

        if (!product?._id) {
            showNotification("Invalid product", "error");
            return;
        }

        try {
            const {orderId, amount} = await apiClient.createOrder({
                product_id: product._id.toString(),
                variant,
            });

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                showNotification("Razorpay key is missing", "error");
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency: "INR",
                name: "ImageKit Shop",
                description: `${product.name} - ${variant.type} Version`,
                order_id: orderId,
                handler: async function () {
                    showNotification("Payment successful!", "success");
                    await apiClient.refreshOrderById(orderId);
                    router.push("/orders");
                },
                prefill: {
                    email: session.user.email,
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            showNotification(
                error instanceof Error ? error.message : "Payment failed",
                "error"
            );
        }
    };

    const getTransformation = (variantType: ImageVariantType): Transformation[] => {
        const variant = IMAGE_VARIANTS[variantType];
        return [
            {
                width: variant.dimensions.width.toString(),
                height: variant.dimensions.height.toString(),
                cropMode: "extract",
                focus: "center",
                quality: 60,
            },
        ];
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <Link href="/#catalog" className="btn btn-ghost btn-sm w-fit gap-2">
                <ArrowLeft className="h-4 w-4"/>
                Back to catalog
            </Link>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                    <div
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-base-200/60"
                        style={{
                            aspectRatio: selectedVariant
                                ? `${IMAGE_VARIANTS[selectedVariant.type].dimensions.width} / ${IMAGE_VARIANTS[selectedVariant.type].dimensions.height}`
                                : "1 / 1",
                        }}
                    >
                        <IKImage
                            urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                            path={product.imageUrl}
                            alt={product.name}
                            transformation={
                                selectedVariant
                                    ? getTransformation(selectedVariant.type)
                                    : getTransformation("SQUARE")
                            }
                            className="h-full w-full object-cover"
                            loading="eager"
                        />
                    </div>

                    {selectedVariant && (
                        <div className="text-center text-sm text-base-content/60">
                            Preview: {IMAGE_VARIANTS[selectedVariant.type].dimensions.width} x {IMAGE_VARIANTS[selectedVariant.type].dimensions.height}px
                        </div>
                    )}
                </div>

                <div className="space-y-6 lg:sticky lg:top-24">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-base-content/60">
                            <ImageIcon className="h-4 w-4"/>
                            Digital asset detail
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">{product.name}</h1>
                        <p className="text-lg leading-7 text-base-content/75">{product.description}</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Available Versions</h2>
                        {product.variants.map((variant) => (
                            <button
                                key={variant.type}
                                type="button"
                                className={`card w-full border border-white/10 bg-base-200/70 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 ${
                                    selectedVariant?.type === variant.type ? "ring-2 ring-primary" : ""
                                }`}
                                onClick={() => setSelectedVariant(variant)}
                            >
                                <div className="card-body p-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-start gap-3">
                                            <ImageIcon className="mt-1 h-5 w-5 flex-none"/>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {IMAGE_VARIANTS[variant.type].label}
                                                </h3>
                                                <p className="text-sm text-base-content/65">
                                                    {IMAGE_VARIANTS[variant.type].dimensions.width} x {IMAGE_VARIANTS[variant.type].dimensions.height}px • {variant.license} license
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 sm:justify-end">
                                            <span className="text-xl font-black">₹{variant.price.toFixed(2)}</span>
                                            <span className="btn btn-primary btn-sm" onClick={(event) => {
                                                event.stopPropagation();
                                                handlePurchase(variant);
                                            }}>
                                                Buy Now
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="card border border-white/10 bg-base-200/70">
                        <div className="card-body p-4">
                            <h3 className="font-semibold mb-2">License Information</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-success"/>
                                    <span>Personal: Use in personal projects</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-success"/>
                                    <span>Commercial: Use in commercial projects</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}