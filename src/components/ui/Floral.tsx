import Image from "next/image";

/**
 * Watercolor-style corner of sunflowers, purple roses and eucalyptus (public/images/floral-corner.svg).
 * Drawn for the top-left corner; rotate 180° for the bottom-right one.
 */
export function Floral({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/floral-corner.svg"
      alt=""
      aria-hidden="true"
      width={300}
      height={300}
      unoptimized
      className={className}
    />
  );
}
