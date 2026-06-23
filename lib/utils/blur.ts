/**
 * Shared blur placeholder for next/image.
 *
 * Hero / product images are referenced by string path or remote URL, so Next
 * cannot auto-generate a `blurDataURL` (auto-blur only works with statically
 * imported files). This tiny neutral-beige SVG (matching the brand surface
 * `#F8F6F3`) is reused as a manual `blurDataURL` for those images.
 *
 * The value is a pre-encoded base64 data URL so it works in both server and
 * client components (no `Buffer`/`btoa` at runtime). It encodes:
 *   <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
 *     <rect width="8" height="8" fill="#F8F6F3"/>
 *   </svg>
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNGOEY2RjMiLz48L3N2Zz4="
