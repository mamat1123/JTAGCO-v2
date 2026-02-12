import { Button } from '@/shared/components/ui/button';
import { X } from 'lucide-react';
import { ProductAttributes } from '@/entities/Product/product';

interface ColorWithImage {
  color: string;
  image: string;
}

interface AttributeListProps {
  attributes: ProductAttributes;
  onRemoveAttribute: (key: string) => void;
}

export function AttributeList({ attributes, onRemoveAttribute }: AttributeListProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderAttributeValue = (key: string, value: any) => {
    // Handle colors array
    if (key === 'colors' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((colorWithImage: ColorWithImage, index: number) => (
            <div key={index} className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
              {colorWithImage.image && (
                <img 
                  src={colorWithImage.image} 
                  alt={colorWithImage.color} 
                  className="w-5 h-5 rounded-full object-cover"
                />
              )}
              <span className="text-sm">{colorWithImage.color}</span>
            </div>
          ))}
        </div>
      );
    }

    // Handle size range
    if (key === 'size' && typeof value === 'string') {
      return <span className="text-sm">{value}</span>;
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
      return <span className="text-sm">{value ? 'มี' : 'ไม่มี'}</span>;
    }

    // Handle other values
    return <span className="text-sm">{String(value)}</span>;
  };

  const getAttributeLabel = (key: string) => {
    const labels: Record<string, string> = {
      size: 'ขนาด',
      colors: 'สี',
      has_insole: 'พื้นรองเท้า',
      has_toe_cap: 'หัวรองเท้า',
      steel_plate: 'แผ่นเหล็ก',
      insoles: 'แผ่นรองในรองเท้า'
    };
    return labels[key] || key;
  };

  return (
    <div className="space-y-2">
      {Object.entries(attributes)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 bg-background rounded-lg border transition-all hover:border-primary/50"
          >
            <div className="space-y-1 min-w-0 flex-1 mr-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {getAttributeLabel(key)}
              </p>
              <div className="flex items-center">
                {renderAttributeValue(key, value)}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveAttribute(key)}
              className="hover:bg-destructive/10 hover:text-destructive h-8 px-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">ลบ</span>
            </Button>
          </div>
        ))}
    </div>
  );
} 