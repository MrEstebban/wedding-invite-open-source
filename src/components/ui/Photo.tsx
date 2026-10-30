import Image from "next/image";

interface PhotoProps {
  src: string;
  alt: string;
  /** Above-the-fold images load eagerly with high priority; the rest are lazy. */
  eager?: boolean;
  sizes?: string;
  className?: string;
}

/** Fills its (relatively positioned) parent with an optimized AVIF/WebP image. */
export function Photo({ src, alt, eager = false, sizes = "(min-width: 640px) 512px, 100vw", className = "" }: PhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      // SVG placeholders cannot go through the optimizer; real photos (jpg/png/webp) do.
      unoptimized={src.endsWith(".svg")}
      className={`object-cover ${className}`}
    />
  );
}
