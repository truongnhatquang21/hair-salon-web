import Image from "next/image";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type IImages = { id: string; src: string };
type CourtCarouselProps = {
  court_images: IImages[];
  court_name: string;
};
export function CourtCarousel({
  court_images,
  court_name,
}: CourtCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div>
      <Carousel setApi={setApi}>
        <CarouselContent className="-ml-4">
          {court_images.map((image) => (
            <CarouselItem key={image.id} className="pl-4">
              <Card className="size-full">
                <CardContent className="flex items-center justify-center p-0">
                  <Image
                    src={image.src}
                    alt={`${court_name}`}
                    width={900}
                    height={400}
                    className="h-[400px] w-full rounded-lg object-cover shadow-lg"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current} of {count}
      </div>
    </div>
  );
}
