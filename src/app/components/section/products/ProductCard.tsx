import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IProduct, IMAGE_VARIANTS } from "@/models/Product";
import { Eye } from "lucide-react";
import { normalizeImagePath } from "@/lib/imagekit-url";

export default function ProductCard({ product, priority = false }: { product: IProduct; priority?: boolean }) {
    const lowestPrice = product.variants.reduce(
        (min, variant) => (variant.price < min ? variant.price : min),
        product.variants[0]?.price || 0
    );

    return (
        <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 h-full border border-base-200">
            <figure className="relative px-4 pt-4">
                <Link
                    href={`/products/${product._id}`}
                    className="relative group w-full"
                >
                    <div
                        className="rounded-xl overflow-hidden relative w-full"
                        style={{
                            aspectRatio:
                                IMAGE_VARIANTS.SQUARE.dimensions.width /
                                IMAGE_VARIANTS.SQUARE.dimensions.height,
                        }}
                    >
                        <IKImage
                            path={normalizeImagePath(product.imageUrl)}
                            alt={product.name}
                            loading={priority ? "eager" : "lazy"}
                            transformation={[
                                {
                                    height: IMAGE_VARIANTS.SQUARE.dimensions.height.toString(),
                                    width: IMAGE_VARIANTS.SQUARE.dimensions.width.toString(),
                                    cropMode: "extract",
                                    focus: "center",
                                    quality: 80,
                                },
                            ]}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
                </Link>
            </figure>

            <div className="card-body p-4 flex-grow">
                <Link
                    href={`/products/${product._id}`}
                    className="hover:opacity-80 transition-opacity"
                >
                    <h2 className="card-title text-lg line-clamp-1" title={product.name}>{product.name}</h2>
                </Link>

                <p className="text-sm text-base-content/70 line-clamp-2 min-h-[2.5rem]" title={product.description}>
                    {product.description}
                </p>

                <div className="card-actions justify-between items-center mt-auto">
                    <div className="flex flex-col">
            <span className="text-lg font-bold">
              From ₹{lowestPrice.toFixed(2)}
            </span>
                        <span className="text-xs text-base-content/50">
              {product.variants.length} sizes available
            </span>
                    </div>

                    <Link
                        href={`/products/${product._id}`}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        View Options
                    </Link>
                </div>
            </div>
        </div>
    );
}