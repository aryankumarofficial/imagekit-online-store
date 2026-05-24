export function normalizeImagePath(imageUrl: string): string {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        try {
            const parsed = new URL(imageUrl);
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
        } catch {
            return imageUrl;
        }
    }

    return imageUrl;
}
