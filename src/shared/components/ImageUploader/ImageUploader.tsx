import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/shared/lib/supabase';

export interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  className?: string;
  bucketName?: string;
  folderPath?: string;
}

export function ImageUploader({
  onImageUploaded,
  onImageRemoved,
  maxSizeMB = 5,
  acceptedFileTypes = 'image/*',
  className = '',
  bucketName = 'images',
  folderPath = 'uploads',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      setIsUploading(true);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      toast.success('อัปโหลดรูปภาพสำเร็จ');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      setImagePreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    setImagePreview('');
    onImageRemoved?.();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageRemove();
                  }}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากและวาง
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF หรือ WEBP (สูงสุด {maxSizeMB}MB)
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
          />
        </label>
      </div>
    </div>
  );
} 