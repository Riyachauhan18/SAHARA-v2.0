
"use client"

import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"

interface HospitalGalleryProps {
    photos: string[]
    title: string
}

export function HospitalGallery({ photos, title }: HospitalGalleryProps) {
    if (!photos || photos.length === 0) {
        return null
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    View Gallery ({photos.length})
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black/95 border-none">
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                    <Carousel className="w-full max-w-3xl">
                        <CarouselContent>
                            {photos.map((photo, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card className="border-none bg-transparent shadow-none">
                                            <CardContent className="flex aspect-video items-center justify-center p-0">
                                                <img
                                                    src={photo}
                                                    alt={`${title} - Photo ${index + 1}`}
                                                    className="w-full h-full object-contain rounded-md"
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                </div>
            </DialogContent>
        </Dialog>
    )
}
