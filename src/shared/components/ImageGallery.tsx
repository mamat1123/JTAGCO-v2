import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/shared/components/ui";
import { storageService } from "@/shared/services/storageService";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ImageGalleryProps {
  images: string[];
  bucket: string;
  isPrivate?: boolean;
  className?: string;
}

export function ImageGallery({ images, bucket, isPrivate = false, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    const loadImageUrls = async () => {
      setIsLoading(true);
      const urls: { [key: string]: string } = {};
      try {
        for (const image of images) {
          if (image.includes('d2pawea85wuy05')) {
            urls[image] = image;
          } else {
            const url = await storageService.getImageUrl(bucket, image, isPrivate);
            urls[image] = url;
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.error('Error loading image URLs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImageUrls();
  }, [images, bucket, isPrivate]);

  const handleImageClick = async (image: string) => {
    setIsModalLoading(true);
    setSelectedImage(imageUrls[image]);
    setIsModalLoading(false);
  };

  if (!images?.length) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-x-auto", className)}>
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: images.length }).map((_, index) => (
            <div key={index} className="aspect-square relative">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ))
        ) : (
          // Actual images
          images.map((image, index) => (
            <div
              key={index}
              className="aspect-square relative cursor-pointer group flex-shrink-0"
              onClick={() => handleImageClick(image)}
            >
              <img
                src={imageUrls[image]}
                alt={`Event image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[800px] p-0 max-h-[90vh] overflow-hidden flex flex-col">
          <VisuallyHidden>
            <DialogTitle>Image Gallery View</DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <div className="overflow-y-auto relative">
              {isModalLoading ? (
                <div className="w-full aspect-video flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <img
                  src={selectedImage}
                  alt="Selected event image"
                  className="w-full h-auto max-h-[90vh] object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 