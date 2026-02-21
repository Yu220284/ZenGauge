
'use client';

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { usePremium } from "@/lib/hooks/use-premium";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const banners = [
  { id: 1, imageUrl: '/ads/Ad_V-WALK.png', alt: 'V-WALK Advertisement' },
  { id: 2, imageUrl: '/ads/Ad_Mary.png', alt: 'MARY Advertisement' },
  { id: 3, imageUrl: '/ads/Ad_RamenPro.png', alt: 'RamenPro Advertisement' },
  { id: 4, imageUrl: '/ads/Ad_WellV.png', alt: 'Well-V Advertisement' },
];

export function AdBanner() {
  const { checkPremiumStatus, showAds } = usePremium();
  const isPremium = checkPremiumStatus();
  const [startIndex] = React.useState(() => Math.floor(Math.random() * banners.length));
  
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  if (isPremium && !showAds) return null;

  return (
    <div className="flex justify-center mt-2 px-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-[600px]"
        opts={{
          align: "center",
          loop: true,
          startIndex,
        }}
      >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="relative w-full aspect-[5/1]">
              <Image
                src={banner.imageUrl}
                alt={banner.alt}
                fill
                className="rounded-lg object-cover"
                unoptimized
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      </Carousel>
    </div>
  );
}
