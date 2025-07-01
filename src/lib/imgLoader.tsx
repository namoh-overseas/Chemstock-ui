// utils/imgLoader.ts
import Image, { ImageProps, ImageLoaderProps } from "next/image";
import { useState } from "react";

export function imgLoader({ src, width, quality }: ImageLoaderProps) {
  let orgSrc = src.split("?")[0];
  return `${orgSrc}?w=${width}&q=${quality || 75}`;
}

export default function FallbackImage(props: ImageProps) {
  const [imgSrc, setImgSrc] = useState(props.src);

  return (
    <Image
      {...props}
      src={imgSrc}
      loader={imgLoader}
      onError={() => setImgSrc("/assets/images/default-product.png")}
    />
  );
}
