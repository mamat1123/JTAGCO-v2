import { X, Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/shared/lib/supabase';
import { Button } from '@/shared/components/ui/button';
import { formatFileSize } from '@/shared/utils/format';

export interface ImageUploaderProps {
  onImageUploaded: (urls: string[]) => void;
  onImageRemoved?: (index?: number) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  className?: string;
  bucketName?: string;
  folderPath?: string;
  multiple?: boolean;
  hasError?: boolean;
}

interface ImagePreview {
  id: string;
  url: string;
  size: string;
  isUploading: boolean;
}

export function ImageUploader({
  onImageUploaded,
  onImageRemoved,
  maxSizeMB = 5,
  acceptedFileTypes = 'image/*',
  className = '',
  bucketName = 'images',
  folderPath = 'uploads',
  multiple = false,
  hasError = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if multiple files are selected when not allowed
    if (!multiple && files.length > 1) {
      toast.error('กรุณาเลือกไฟล์เพียง 1 ไฟล์');
      return;
    }

    // Check file sizes
    const invalidFiles = files.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSizeMB}MB`);
      return;
    }

    // Create previews
    const newPreviews = files.map(file => ({
      id: Math.random().toString(36).substring(2),
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
      isUploading: true,
      file,
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);

    try {
      setIsUploading(true);

      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('User not authenticated');
      }

      const uploadPromises = newPreviews.map(async (preview) => {
        const file = preview.file as File;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folderPath}/${fileName}`;

        const { error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Update previews to show upload complete
      setImagePreviews(prev => 
        prev.map(preview => ({
          ...preview,
          isUploading: false,
        }))
      );

      onImageUploaded(uploadedUrls);
      toast.success('อัปโหลดรูปภาพสำเร็จ');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      // Remove failed uploads
      setImagePreviews(prev => prev.filter(p => !newPreviews.find(np => np.id === p.id)));
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = (id: string) => {
    const index = imagePreviews.findIndex(p => p.id === id);
    setImagePreviews(prev => prev.filter(p => p.id !== id));
    onImageRemoved?.(index);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className={`relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          } ${hasError ? 'border-red-500 bg-red-50' : ''}`}
        >
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {imagePreviews.map((preview) => (
                  <div key={preview.id} className="relative aspect-square">
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {preview.isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      {preview.size}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleImageRemove(preview.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-background/90 text-foreground rounded-full hover:bg-destructive hover:text-white transition-colors shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {isUploading ? (
                  <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary" />
                ) : (
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                )}
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากและวาง
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF หรือ WEBP (สูงสุด {maxSizeMB}MB)
                  {multiple && ' - สามารถเลือกได้หลายไฟล์'}
                </p>
              </>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleImageSelect}
            disabled={isUploading}
            multiple={multiple}
          />
        </label>
      </div>
      {imagePreviews.length > 0 && !isUploading && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setImagePreviews([]);
              onImageRemoved?.();
            }}
            className="text-destructive hover:text-destructive"
          >
            ยกเลิกทั้งหมด
          </Button>
        </div>
      )}
    </div>
  );
}