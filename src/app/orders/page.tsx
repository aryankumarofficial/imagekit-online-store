"use client";

import {useEffect, useState, useCallback} from "react";
import {useSession} from "next-auth/react";
import {IOrder} from "@/models/Order";
import {IKImage} from "imagekitio-next";
import {IMAGE_VARIANTS} from "@/models/Product";
import {apiClient} from "@/lib/api-client";
import {Download, Loader2, LucideBadgeIndianRupee, RefreshCw} from "lucide-react";
import {NotificationTypes, useNotification} from "@/app/components/Notification";
import {useRouter} from "next/navigation";

type PopulatedProduct = {
    _id: string;
    name: string;
    imageUrl: string;
};

function isPopulatedProduct(value: unknown): value is PopulatedProduct {
    return typeof value === "object" && value !== null && "imageUrl" in value && "name" in value;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const {data: session} = useSession();
    const {showNotification} = useNotification();
    const router = useRouter();

    const fetchOrders = useCallback(async () => {
        try {
            const data = await apiClient.getUserOrders();
            setOrders(data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshOrder = async (id: string) => {
        try {
            const data: any = await apiClient.refreshOrderById(id);
            showNotification(data.message, NotificationTypes.SUCCESS);
            router.refresh();
        } catch (error) {
            console.error("Error refreshing order:", error);
            showNotification("Error refreshing order", NotificationTypes.ERROR);
        }
    }

    useEffect(() => {
        if (session) {
            fetchOrders();
        }
    }, [session, fetchOrders]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary"/>
            </div>
        );
    }

    const handleRepay = async (order: IOrder) => {
        try {
            if (!isPopulatedProduct(order.productId)) {
                showNotification("Product details not found. Cannot proceed with payment.", NotificationTypes.WARNING)
                throw new Error("Product details not found. Cannot proceed with payment.");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: "INR",
                name: "ImageKit Shop",
                description: `${order.productId.name} - ${order.variant.type} Version`,
                order_id: order.razorpayOrderId,
                handler: async function () {
                    showNotification("Payment successful!", NotificationTypes.SUCCESS)
                    await apiClient.refreshOrderById(order.razorpayOrderId);
                    router.push("/orders");
                    await fetchOrders();
                },
                prefill: {
                    email: session?.user?.email
                },
                theme: {
                    color: "#3399cc",
                    backdrop_color: "#f4f4f4"
                },
            }

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch
            (error) {
            console.error(error);
            showNotification(
                error instanceof Error ? error.message : "Payment failed",
                NotificationTypes.ERROR
            );
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="space-y-6">
                {orders.length > 0 && orders.map((order) => {
                    const variantDimensions = IMAGE_VARIANTS[
                        order.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                        ].dimensions;

                    const product = isPopulatedProduct(order.productId) ? order.productId : null;

                    return (
                        <div
                            key={order._id?.toString()}
                            className="card bg-base-100 shadow-xl"
                        >
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Preview Image - Low Quality */}
                                    <div
                                        className="relative rounded-lg overflow-hidden bg-base-200"
                                        style={{
                                            width: "200px",
                                            aspectRatio: `${variantDimensions.width} / ${variantDimensions.height}`,
                                        }}
                                    >
                                            <IKImage
                                            urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
                                                path={product?.imageUrl || ""}
                                            alt={`Order ${order._id?.toString().slice(-6)}`}
                                            transformation={[
                                                {
                                                    quality: 60,
                                                    width: variantDimensions.width.toString(),
                                                    height: variantDimensions.height.toString(),
                                                    cropMode: "extract",
                                                    focus: "center",
                                                },
                                            ]}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Order Details */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-bold mb-2">
                                                    Order #{order._id?.toString().slice(-6)}
                                                </h2>
                                                <div className="space-y-1 text-base-content/70">
                                                    <p>
                                                        Resolution: {variantDimensions.width} x{" "}
                                                        {variantDimensions.height}px
                                                    </p>
                                                    <p>
                                                        License Type:{" "}
                                                        <span className="capitalize">
                              {order.variant.license}
                            </span>
                                                    </p>
                                                    <p>
                                                        Status:{" "}
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                order.status === "completed"
                                                                    ? "bg-success/20 text-success"
                                                                    : order.status === "failed"
                                                                        ? "bg-error/20 text-error"
                                                                        : "bg-warning/20 text-warning"
                                                            }`}
                                                        >
                              {order.status}
                            </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-2xl font-bold mb-4">
                                                    ₹{(order.amount / 100).toFixed(2)}
                                                </p>
                                                {order.status === "completed" ? (
                                                    <a
                                                        href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${variantDimensions.width},h-${variantDimensions.height},cm-extract,fo-center${product?.imageUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-primary gap-2"
                                                        download={`image-${order._id
                                                            ?.toString()
                                                            .slice(-6)}.jpg`}
                                                    >
                                                        <Download className="w-4 h-4"/>
                                                        Download High Quality
                                                    </a>
                                                ) : (
                                                    <div className={"flex flex-row gap-10"}>
                                                        <button
                                                            className="btn btn-primary gap-2"
                                                            onClick={() => handleRepay(order)}
                                                        >
                                                            <LucideBadgeIndianRupee className="w-6 h-6"/>
                                                            Pay to Download
                                                        </button>
                                                        <button
                                                            className="btn btn-primary gap-2"
                                                            onClick={() => refreshOrder(order.razorpayOrderId)}
                                                        >
                                                            <RefreshCw className="w-6 h-6"/>
                                                            Refresh
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                        ;
                })}

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-base-content/70 text-lg">No orders found</div>
                    </div>
                )}
            </div>
        </div>
    );
}