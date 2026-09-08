import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function MyPictures() {
  return (
    <div className="w-full">
      <Carousel className="w-full" opts={{ align: "center" }}>
        <CarouselContent className="">
          {[
            {
              label: "Picture 02",
              path: "002.png",
            },
            {
              label: "Picture 01",
              path: "001.png",
            },
            {
              label: "Picture 03",
              path: "003.png",
            },
            {
              label: "Picture 04",
              path: "004.png",
            },
            {
              label: "Picture 05",
              path: "005.png",
            },
            {
              label: "Picture 06",
              path: "006.png",
            },
          ].map((picture) => (
            <CarouselItem key={picture.path} className="basis-1/5 p-0">
              <Image
                alt={picture.label}
                width={200}
                height={300}
                className="size-full object-cover"
                src={`/assets/${picture.path}`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={"left-4 md:-left-14 rounded-none"}
          variant={"secondary"}
        />
        <CarouselNext
          className={"right-4 md:-right-14 rounded-none"}
          variant={"secondary"}
        />
      </Carousel>
    </div>
  );
}
