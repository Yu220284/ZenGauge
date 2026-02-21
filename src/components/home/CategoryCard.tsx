import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  href: string;
  isFavorite?: boolean;
}

export function CategoryCard({
  name,
  description,
  imageUrl,
  imageHint,
  href,
  isFavorite = false,
}: CategoryCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-32 md:h-48 w-full">
          <Image
            src={imageUrl}
            alt={description}
            data-ai-hint={imageHint}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

        </div>
        <CardHeader className="flex-grow">
          <CardTitle className="font-headline text-lg md:text-xl flex items-center justify-between">
            {name}
            <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </CardTitle>
          <CardDescription className="pt-1 text-xs md:text-sm">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
