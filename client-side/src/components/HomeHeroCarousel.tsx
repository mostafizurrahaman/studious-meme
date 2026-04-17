'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type HeroSlide = {
    title: string;
    description: string;
    image: string;
    href: string;
};

type HomeHeroCarouselProps = {
    slides: HeroSlide[];
    features?: HeroSlide[];
};

export function HomeHeroCarousel({ slides, features }: HomeHeroCarouselProps) {
    const [heroIndex, setHeroIndex] = useState(0);
    const featureCards = features?.length ? features : slides;

    useEffect(() => {
        const timer = window.setInterval(() => {
            setHeroIndex(prev => (prev + 1) % slides.length);
        }, 5000);

        return () => window.clearInterval(timer);
    }, [slides.length]);

    const heroSlide = slides[heroIndex] ?? slides[0];
    const topFeature = featureCards[1] ?? featureCards[0] ?? heroSlide;
    const bottomFeatures = [featureCards[0], featureCards[2]].filter(Boolean) as HeroSlide[];

    return (
        <Card className="overflow-hidden shadow-sm">
            <div className="grid h-full gap-0 p-0 sm:gap-4 sm:p-6 lg:grid-cols-[1.22fr_0.78fr] lg:p-6">
                <div className="ui-image-card relative min-h-105 overflow-hidden rounded-3xl bg-background sm:min-h-125 lg:min-h-125">
                    <Image
                        src={heroSlide.image}
                        alt={heroSlide.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 760px"
                        className="object-cover object-[center_top] transition duration-500 ease-out"
                    />

                    <Button
                        type="button"
                        onClick={() => setHeroIndex(prev => (prev - 1 + slides.length) % slides.length)}
                        aria-label="Previous banner"
                        variant="secondary"
                        size="icon"
                        className="absolute left-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-transparent text-foreground shadow-md backdrop-blur-sm transition hover:bg-background"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setHeroIndex(prev => (prev + 1) % slides.length)}
                        aria-label="Next banner"
                        variant="secondary"
                        size="icon"
                        className="absolute right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-transparent text-foreground shadow-md backdrop-blur-sm transition hover:bg-background"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-background/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                        {slides.map((slide, index) => (
                            <button
                                key={`${slide.title}-${index}`}
                                type="button"
                                onClick={() => setHeroIndex(index)}
                                aria-label={`Go to banner ${index + 1}`}
                                className={`h-2.5 rounded-full transition-all ${index === heroIndex ? 'w-7 bg-primary' : 'w-2.5 bg-border'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="hidden gap-4 lg:grid lg:grid-cols-1">
                    <Link
                        href={topFeature.href}
                        className="ui-image-card group relative min-h-80 cursor-pointer overflow-hidden rounded-3xl border border-border bg-muted shadow-sm"
                    >
                        <Image
                            src={topFeature.image}
                            alt={topFeature.title}
                            fill
                            sizes="(max-width: 1024px) 33vw, 300px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black/10 via-black/5 to-transparent" />
                        <Badge className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white shadow-sm">
                            Feature 1
                        </Badge>
                    </Link>

                    <div className="grid grid-cols-2 gap-4">
                        {bottomFeatures.map((slide, index) => (
                            <Link
                                key={`${slide.title}-${index}`}
                                href={slide.href}
                                className="ui-image-card group relative min-h-40 cursor-pointer overflow-hidden rounded-3xl border border-border bg-muted shadow-sm"
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    sizes="(max-width: 1024px) 16vw, 150px"
                                    className="object-cover transition duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-r from-black/10 via-black/5 to-transparent" />
                                <Badge className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white shadow-sm">
                                    Feature {index + 2}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
