import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative mb-8 w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <img
                    src="/lovable-uploads/3426429b-2dfc-4a2d-9484-3932c3efec09.png"
                    alt="Club Cars Logo"
                    className="h-12 w-auto"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === current
                ? "w-8 bg-foreground"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;