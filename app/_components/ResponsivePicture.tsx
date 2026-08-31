import type { ImgHTMLAttributes } from "react";

type ResponsivePictureProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "src" | "srcSet"
> & {
  alt: string;
  src: string;
  webpSrcSet: string;
};

export function ResponsivePicture({
  alt,
  sizes,
  src,
  webpSrcSet,
  ...imageProps
}: ResponsivePictureProps) {
  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img src={src} alt={alt} sizes={sizes} {...imageProps} />
    </picture>
  );
}
