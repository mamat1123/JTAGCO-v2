import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/shared/components/ui";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images?.length) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-x-auto", className)}>
        {images.map((image, index) => (
          <div
            key={index}
            className="aspect-square relative cursor-pointer group flex-shrink-0"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Event image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[800px] p-0 max-h-[90vh] overflow-hidden flex flex-col">
          <VisuallyHidden>
            <DialogTitle>Image Gallery View</DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <div className="overflow-y-auto">
              <img
                src={selectedImage}
                alt="Selected event image"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 